# Fablet AI service setup (Windows)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Test-Path '.venv')) {
    py -3.12 -m venv .venv
}

.\.venv\Scripts\python.exe -m pip install --upgrade pip --quiet
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# The Chroma embedding model bundle is ~80MB on a slow S3 bucket; the library's
# own downloader times out on slow links, so fetch it once with a long timeout.
$dest = Join-Path $env:USERPROFILE '.cache\chroma\onnx_models\all-MiniLM-L6-v2'
$model = Join-Path $dest 'onnx\model.onnx'
if (-not (Test-Path $model)) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    $tar = Join-Path $dest 'onnx.tar.gz'
    curl.exe -L --retry 5 --retry-delay 3 --max-time 1800 -o $tar 'https://chroma-onnx-models.s3.amazonaws.com/all-MiniLM-L6-v2/onnx.tar.gz'
    $expected = '913d7300ceae3b2dbc2c50d1de4baacab4be7b9380491c27fab7418616a16ec3'
    $actual = (Get-FileHash $tar -Algorithm SHA256).Hash.ToLower()
    if ($actual -ne $expected) { throw "ONNX model checksum mismatch" }
    tar -xzf $tar -C $dest
}

Write-Host 'AI service ready. Start it with:'
Write-Host '  cd Fablet\AI; .\.venv\Scripts\python.exe app.py'
