class Registrator:
    def __init__(self):
        self.template_containers = {}
        self.templates = {}

        self.message_handlers = {}
        self.callback_handlers = {}
        self.callers = {}

    def call(self, name: str, **kwargs):
        return self.callers[name]["caller"](**kwargs)

    def caller(self, name: str):
        def wrapper(handler):
            self.callers[name] = {
                "caller": handler
            }
            return handler

        return wrapper

    def message(self, command: str):
        def wrapper(handler):
            self.message_handlers[command] = {
                "handler": handler,
            }
            return handler

        return wrapper

    def callback(self, command: str):
        def wrapper(handler):
            self.callback_handlers[command] = {
                "handler": handler,
            }
            return handler

        return wrapper

    def template_container(self, name):
        def wrapper(handler):
            self.template_containers[name] = handler
            return handler

        return wrapper

    def template(self, name, container: str | None = None):
        def wrapper(handler):
            self.templates[name] = {
                "handler": handler,
                "container_name": container
            }
            return handler

        return wrapper
