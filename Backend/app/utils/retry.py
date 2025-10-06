"""
Retry utilities for handling transient database errors
"""
import asyncio
from functools import wraps
from typing import Any
from neo4j.exceptions import SessionExpired, ServiceUnavailable, TransientError


def async_retry(
    max_attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple = (SessionExpired, ServiceUnavailable, TransientError)
):
    """
    Decorator to retry async functions on transient errors
    
    Args:
        max_attempts: Maximum number of retry attempts
        delay: Initial delay between retries in seconds
        backoff: Multiplier for delay on each retry
        exceptions: Tuple of exceptions to catch and retry
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any):
            current_delay = delay
            last_exception = None
            
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        print(f"Attempt {attempt + 1}/{max_attempts} failed: {str(e)}. Retrying in {current_delay}s...")
                        await asyncio.sleep(current_delay)
                        current_delay *= backoff
                    else:
                        print(f"All {max_attempts} attempts failed. Raising exception.")
                        raise last_exception
            
            # This should never be reached, but just in case
            if last_exception:
                raise last_exception
            return None  # type: ignore
        
        return wrapper
    return decorator
