Write-Host "Building docs in" $PSScriptRoot

# If building from AppVeyor, the version will be populated. In that case,
# resource paths need to be prefixed with "/vue-tree/<version>" and demo metadata
# should point to unpkg.com for that version
$siteRoot = $env:package_version
if (-not [System.String]::IsNullOrEmpty($siteRoot)) {
    $siteRoot = -Join ("/vue-tree/", $siteRoot);

    $metafile = (Join-Path -Path $PSScriptRoot -ChildPath "metadata.demo.yaml")
    (Get-Content $metafile) -replace 'http://localhost:8082', (-Join ('https://unpkg.com/@grapoza/vue-tree@', $env:package_version)) | Set-Content $metafile
}

Get-ChildItem $PSScriptRoot\*  -Recurse -Include *.md, *.css, *.js, *.png | Where-Object { -not $_.PsIsContainer -and $_.DirectoryName -notmatch 'output' } |
Foreach-Object {

    if ($_.Name -eq "README.md") {
        Write-Host "Skipping" $_.FullName
        Return
    }

    Write-Host "Processing" $_.FullName

    # Create the dir if it doesn't exist.
    $outdir = $_.DirectoryName.Replace($PSScriptRoot, (Join-Path -Path $PSScriptRoot -ChildPath "output"))
    New-Item $outdir -type directory -ErrorAction SilentlyContinue | Out-Null

    if ($_.Extension.ToLowerInvariant() -eq ".md") {
        # Get the target file name
        $outfile = Join-Path -Path $outdir -ChildPath ($_.BaseName + ".html")

        # Invoke (&) the pandoc command; check here for either Windows or *nix separator
        if ($outfile.Contains("\demo\") -or $outfile.Contains("/demo/")) {
            & pandoc -s --template=templates/base.html5 --metadata-file=metadata.yaml -V site-root=$siteRoot -o $outfile metadata.demo.yaml $_.FullName
        }
        else {
            & pandoc -s --template=templates/base.html5 --metadata-file=metadata.yaml -V site-root=$siteRoot -o $outfile $_.FullName
        }
    }
    else {
        Copy-Item $_.FullName -Destination $outdir
    }
}