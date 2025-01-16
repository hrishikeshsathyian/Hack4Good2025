from typing import Optional
from pydantic import BaseModel, Field


def _generic_repr(self) -> str:
    class_name = self.__class__.__name__
    attributes = ", ".join(f"{key}={value!r}" for key, value in vars(self).items())
    return f"{class_name}({attributes})"

class AiOutput(BaseModel):
    def __repr__(self) -> str:
        return _generic_repr(self)


class AiWeeklySummaryOutput(AiOutput):

    high_demand_items_to_purchase : str = Field(
        description="The list of items that we should purchase more based on the previous purchases "
    )
