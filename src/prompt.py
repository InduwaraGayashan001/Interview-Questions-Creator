prompt_template = """
You are an expert in generating interview questions from a given text.

Your goal is to generate a list of 10 clear and relevant questions that can help someone prepare for an interview based on the content of the provided text. Do not include any explanations or formatting—just return a plain Python-style list of questions as strings.

----------------
{text}
----------------

Generate exactly 10 questions in a plain Python list format (e.g., ["Question 1?", "Question 2?", ...]):

Questions:
"""


refine_template = """
You are an expert in refining interview questions based on new context.

We have a draft list of questions: {existing_answer}
We now have additional context which may help improve or update the questions.

----------------
{text}
----------------

Your task is to:
- Refine the original questions using the new context.
- If the new context is not helpful, return the original questions.
- Return the result as a plain Python list of 10 questions (e.g., ["Question 1?", "Question 2?", ...]).
- Do not include any extra explanation or formatting.

Questions:
"""
