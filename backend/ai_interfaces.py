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
    answer : str = Field(
        description="Based on the query and the given data points, this is the answer that the AI has generated for the user"
    )
