Write-Host "Building docs in " $PSScriptRoot

Get-ChildItem $PSScriptRoot\*  -Recurse -Include *.md, *.css, *.js, *.png | Where-Object { -not $_.PsIsContainer -and $_.DirectoryName -notmatch 'output' } |
Foreach-Object {
    Write-Host "Processing " $_.FullName

    # Create the dir if it doesn't exist.
    $outdir = $_.DirectoryName.Replace($PSScriptRoot, (Join-Path -Path $PSScriptRoot -ChildPath "output"))
    New-Item $outdir -type directory -ErrorAction SilentlyContinue | Out-Null

    if ($_.Extension.ToLowerInvariant() -eq ".md") {
        # Get the target file name
        $outfile = Join-Path -Path $outdir -ChildPath ($_.BaseName + ".html")

        # Invoke (&) the pandoc command
        if($outfile.Contains("\demo\")) {
            & pandoc -s --template=templates/base.html5 --metadata-file=metadata.yaml -o $outfile metadata.demo.yaml $_.FullName
        }
        else {
            & pandoc -s --template=templates/base.html5 --metadata-file=metadata.yaml -o $outfile $_.FullName
        }
    }
    else {
        Copy-Item $_.FullName -Destination $outdir
    }
}