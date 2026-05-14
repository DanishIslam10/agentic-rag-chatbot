import hashlib

def normalize_repo_url(repo_url: str) -> str:

    repo_url = repo_url.strip("/")

    repo_url = repo_url.lower()

    if repo_url.endswith(".git") :
        repo_url = repo_url[:-4]

    repo_url = repo_url.rstrip("/")

    return repo_url


def generate_repo_hash(normalized_repo_url: str) -> str:

    return hashlib.sha256(
        normalized_repo_url.encode()
    ).hexdigest()


def extract_repo_name(normalized_repo_url: str):

    return normalized_repo_url.rstrip("/").split("/")[-1]

    

# TESTING
# if __name__ == "__main__":
    
#     url = "HTTPS://github.com/langchain-ai/langgraph.git/"
#     res = normalize_repo_url(url)
#     print(res)
#     hash = generate_repo_hash(res)
#     print(hash)

#     repo_name = extract_repo_name(res)

#     print(repo_name)