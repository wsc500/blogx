import logging

def NewError(message,err):
    # Handle with error.
    # [message] is readable-text and [err] is Exception.
    logger = logging.getLogger(__name__)
    logger.error("%s :: %s".format(message,err))



