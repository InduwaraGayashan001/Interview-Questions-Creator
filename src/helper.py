import os
import ast
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import TokenTextSplitter
from langchain.docstore.document import Document
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from src.prompt import *

# Load environment variables from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

def file_processing(file_path):

    loader = PyPDFLoader(file_path)
    data = loader.load()

    question_gen = ""
    for page in data:
        question_gen += page.page_content + "\n"
    
    splitter_ques_gen = TokenTextSplitter(
        model_name="gpt-4o-mini",
        chunk_size=10000,
        chunk_overlap=200,
    )

    chunks_ques_gen = splitter_ques_gen.split_text(question_gen)
    documents_ques_gen = [Document(page_content=chunk) for chunk in chunks_ques_gen]

    splitter_ans_gen = TokenTextSplitter(
        model_name="gpt-4o-mini",
        chunk_size=1000,
        chunk_overlap=100,
    )

    documents_ans_gen = splitter_ans_gen.split_documents(documents_ques_gen)

    return documents_ques_gen, documents_ans_gen

def llm_pipeline(file_path):

    documents_ques_gen, documents_ans_gen = file_processing(file_path)

    llm_ques_gen_pipeline = ChatOpenAI(
        model="openai/gpt-4.1-mini",
        base_url="https://models.github.ai/inference",
        temperature=0.3,
    )

    prompt_questions = PromptTemplate(
        input_variables=["text"],
        template=prompt_template,
    )

    refine_prompt_questions = PromptTemplate(
        input_variables=["existing_answer", "text"],
        template=refine_template,
    )

    question_gen_chain = load_summarize_chain(
        llm=llm_ques_gen_pipeline,
        chain_type="refine",
        question_prompt=prompt_questions,
        refine_prompt=refine_prompt_questions,
    )
    ques = question_gen_chain.invoke(documents_ans_gen)

    try:
        questions_list = ast.literal_eval(ques["output_text"])
    except Exception as e:
        print("Error parsing LLM output:", e)
        questions_list = []

    embeddings = OpenAIEmbeddings(
        model = "text-embedding-3-small",
        openai_api_base = "https://models.inference.ai.azure.com",
    )

    vectorstore = FAISS.from_documents(
        documents=documents_ans_gen,
        embedding=embeddings,
    )

    llm_answer_gen = ChatOpenAI(
        model="openai/gpt-4.1-mini",
        base_url="https://models.github.ai/inference",
        temperature=0.1,
    )

    answer_generation_chain = RetrievalQA.from_chain_type(
        llm=llm_answer_gen,
        chain_type="stuff",
        retriever=vectorstore.as_retriever()
    )

    return answer_generation_chain, questions_list

