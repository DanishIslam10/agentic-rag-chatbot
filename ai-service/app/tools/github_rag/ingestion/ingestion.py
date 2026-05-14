from pathlib import Path
from fastapi import HTTPException, UploadFile
from langsmith import traceable
from langchain_community.document_loaders import PyPDFLoader

from app.tools.github_rag.ingestion.splitter import split_documents
from app.tools.github_rag.ingestion.embedder import create_vector_store


# Base folder for uploaded PDFs
PDF_STORAGE_FOLDER = Path("app/tools/pdf_rag/pdfs")


@traceable(name="pdf_ingestion_pipeline")
async def ingestion_pipeline(pdf_files: list[UploadFile],user_id: str,thread_id: str):

    try:

        if not pdf_files:

            raise HTTPException(
                status_code=400,
                detail="No PDF files uploaded."
            )

        # create pdf storage directory
        PDF_STORAGE_FOLDER.mkdir(
            parents=True,
            exist_ok=True
        )

        all_docs = []

        for pdf_file in pdf_files:

            # validate pdf
            if not pdf_file.filename.endswith(".pdf"):

                raise HTTPException(
                    status_code=400,
                    detail=f"{pdf_file.filename} is not a PDF file."
                )

            # final file path
            file_path = PDF_STORAGE_FOLDER / pdf_file.filename

            # save pdf locally
            content = await pdf_file.read()

            with open(file_path, "wb") as f:
                f.write(content)

            try:

                # load pdf
                loader = PyPDFLoader(str(file_path))

                docs = loader.load()

                # attach metadata
                for doc in docs:

                    doc.metadata["user_id"] = user_id

                    doc.metadata["thread_id"] = thread_id

                    doc.metadata["source_type"] = "pdf"

                    doc.metadata["file_name"] = pdf_file.filename

                    doc.metadata["file_path"] = str(file_path)

                all_docs.extend(docs)

            except Exception as e:

                raise HTTPException(
                    status_code=500,
                    detail=f"PDF loading failed for {pdf_file.filename}: {str(e)}"
                )

        # split documents
        splitted_docs = split_documents(all_docs)

        # create embeddings + vector store
        create_vector_store(splitted_docs)

        return {
            "success": True,
            "message": "PDF ingestion successful.",
            "total_documents": len(all_docs),
            "total_chunks": len(splitted_docs)
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Unexpected server error in PDF ingestion pipeline: {str(e)}"
        )