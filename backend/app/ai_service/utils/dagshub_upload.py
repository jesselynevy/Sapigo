"""
 Utility to upload the dataset to dagshub, usage :
 
 uv run python utils/dagshub_upload.py \
  --owner <you> --repo sapigo \
  --local-path /mnt/c/.../english_cow_dataset \
  --remote-path data/english_cow_dataset \
  --message "English cow dataset, unsplit, initial upload"
"""
import argparse
import os
from datetime import datetime, timezone

from dagshub.upload import Repo


def upload_dataset(
    owner: str,
    repo_name: str,
    local_path: str,
    remote_path: str,
    commit_message: str,
    branch: str = "main",
) -> None:
    """
    Upload `local_path` (a folder or file on disk) to `remote_path`
    inside the DagsHub repo `owner/repo_name`, as a new commit on `branch`.
    """
    if not os.path.exists(local_path):
        raise FileNotFoundError(f"Local dataset path does not exist: {local_path}")

    repo = Repo(owner, repo_name, branch=branch)

    print(f"Uploading '{local_path}' -> '{owner}/{repo_name}:{remote_path}' "
          f"on branch '{branch}'...")

    repo.upload(
        remote_path=remote_path,
        local_path=local_path,
        commit_message=commit_message,
    )

    print("Upload complete.")
    print(f"View history at: https://dagshub.com/{owner}/{repo_name}/commits/{branch}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload a dataset snapshot to DagsHub.")
    parser.add_argument("--owner", required=True, help="DagsHub username/org")
    parser.add_argument("--repo", required=True, help="DagsHub repo name (e.g. sapigo)")
    parser.add_argument("--local-path", required=True,
                         help="Path to the local dataset folder, e.g. /mnt/c/.../english_cow_dataset")
    parser.add_argument("--remote-path", default="data/english_cow_dataset",
                         help="Destination path inside the DagsHub repo")
    parser.add_argument("--branch", default="main")
    parser.add_argument("--message", default=None,
                         help="Commit message. Defaults to an auto-generated timestamped message.")

    args = parser.parse_args()

    message = args.message or f"Update dataset: {os.path.basename(args.local_path)}"

    upload_dataset(
        owner=args.owner,
        repo_name=args.repo,
        local_path=args.local_path,
        remote_path=args.remote_path,
        commit_message=message,
        branch=args.branch,
    )
