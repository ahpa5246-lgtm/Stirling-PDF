"""Exercise PDF operations against a running local Stirling server.

Install pypdf and set STIRLING_BASE_URL when the server is not at localhost:8080.
Only synthetic PDFs and attachments are sent to the specified server.
"""

import io
import os
import urllib.error
import urllib.request
import uuid
import zipfile
from types import SimpleNamespace

from pypdf import PdfReader, PdfWriter

BASE_URL = os.environ.get("STIRLING_BASE_URL", "http://127.0.0.1:8080").rstrip("/")


def call(path, content, fields):
    boundary = "stirling-" + uuid.uuid4().hex
    pieces = []
    for key, value in fields.items():
        pieces.append(
            f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n'.encode()
        )
    pieces.extend(
        [
            f'--{boundary}\r\nContent-Disposition: form-data; name="fileInput"; filename="test.pdf"\r\n'
            "Content-Type: application/pdf\r\n\r\n".encode(),
            content,
            f"\r\n--{boundary}--\r\n".encode(),
        ]
    )
    request = urllib.request.Request(
        BASE_URL + path,
        data=b"".join(pieces),
        headers={"Content-Type": "multipart/form-data; boundary=" + boundary},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return SimpleNamespace(status_code=response.status, content=response.read())
    except urllib.error.HTTPError as error:
        return SimpleNamespace(status_code=error.code, content=error.read())


def check(condition, description):
    print(("PASS " if condition else "FAIL ") + description, flush=True)
    if not condition:
        raise SystemExit(1)


def main():
    writer = PdfWriter()
    for _ in range(5):
        writer.add_blank_page(width=300, height=400)
    writer.add_attachment("alpha.txt", b"alpha-content")
    writer.add_attachment("beta.txt", b"beta-content")
    buffer = io.BytesIO()
    writer.write(buffer)
    source = buffer.getvalue()

    response = call("/api/v1/general/split-pages", source, {"pageNumbers": "2,4"})
    check(response.status_code == 200, f"split returned HTTP 200 (got {response.status_code})")
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        names = sorted(name for name in archive.namelist() if name.endswith(".pdf"))
        counts = [len(PdfReader(io.BytesIO(archive.read(name))).pages) for name in names]
        check(counts == [2, 2, 1], f"split page counts are 2, 2, 1: {counts}")

    response = call("/api/v1/misc/extract-attachments", source, {})
    check(response.status_code == 200, f"extract returned HTTP 200 (got {response.status_code})")
    with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
        check(
            archive.read("alpha.txt") == b"alpha-content" and archive.read("beta.txt") == b"beta-content",
            "both original attachment contents survived extraction",
        )

    response = call(
        "/api/v1/misc/rename-attachment", source, {"attachmentName": "alpha.txt", "newName": "beta.txt"}
    )
    check(400 <= response.status_code < 500, f"duplicate rename returned a client error ({response.status_code})")
    response = call(
        "/api/v1/misc/rename-attachment", source, {"attachmentName": "alpha.txt", "newName": "gamma.txt"}
    )
    check(response.status_code == 200, f"rename returned HTTP 200 (got {response.status_code})")
    extracted = call("/api/v1/misc/extract-attachments", response.content, {})
    check(extracted.status_code == 200, "renamed PDF remains readable")
    with zipfile.ZipFile(io.BytesIO(extracted.content)) as archive:
        check(
            set(archive.namelist()) == {"gamma.txt", "beta.txt"}
            and archive.read("gamma.txt") == b"alpha-content"
            and archive.read("beta.txt") == b"beta-content",
            "renamed and untouched attachments retain their bytes",
        )

    response = call("/api/v1/misc/delete-attachment", source, {"attachmentName": "alpha.txt"})
    check(response.status_code == 200, f"delete returned HTTP 200 (got {response.status_code})")
    extracted = call("/api/v1/misc/extract-attachments", response.content, {})
    check(extracted.status_code == 200, "PDF remains readable after deletion")
    with zipfile.ZipFile(io.BytesIO(extracted.content)) as archive:
        check(
            archive.namelist() == ["beta.txt"] and archive.read("beta.txt") == b"beta-content",
            "only the selected attachment was removed",
        )

    response = call(
        "/api/v1/misc/scanner-effect",
        source,
        {"quality": "low", "rotation": "none", "rotateVariance": "0", "colorspace": "grayscale", "advancedEnabled": "false"},
    )
    check(response.status_code == 200, f"scanner effect returned HTTP 200 (got {response.status_code})")
    check(len(PdfReader(io.BytesIO(response.content)).pages) == 5, "scanner effect retained all five pages")


if __name__ == "__main__":
    main()
