from typing import Dict


class Response:
    def __init__(self, template: str,
                 widget: bool = False,
                 plain: str | None = None,
                 update_data: Dict = None,
                 logs: str | None = None):

        self.plain = plain
        self.template_name = template
        self.update_data = update_data
        self.is_widget = widget
        self.logs = logs
