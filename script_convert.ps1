# Put this file on a folder containing the files to be converted
# It will create a folder called "imgs" with the converted files
# identified by folders named SxxExx
# where Sxx is the season number and Exx is the episode number that you can set below

$season = "01" # you can set any other string here, it is used to identify the "season"
$episode = 1
$fileExtensionToProcess = 'mkv' # Set here the file extension of the video files to process (mkv, mp4, avi, etc)
$fileExtensionImageOutput = 'jpg' # jpg or png, jpg has less quality but the file size is smaller compared to png which is lossless
$imageQuality = 1 # Set here the compression level from 1 to 31, lower is better quality
$outDir = ".\imgs\" # Set here the output directory

$path = Get-Location
$scriptName =  "$($path)\$($MyInvocation.MyCommand.Name)"

if (!(Test-Path $outDir))
{
    New-Item -ItemType Directory -Path $outDir
}

foreach($file in Get-ChildItem $path)
{
    #if episode is below 10, add 0 before
    if ($episode -lt 10)
    {
        $episodeStr = "0$episode"
    }
    else
    {
        $episodeStr = $episode
    }

    Write-Output "Reading file: $($file)"
    if($file -like "*.$($fileExtensionToProcess)")
    {
        $outDirEp = "$($outDir)\S$($season)E$($episodeStr)\"
        if (!(Test-Path $outDirEp))
        {
            New-Item -ItemType Directory -Path $outDirEp
        }

        $outFileName = "$($outDirEp)\S$($season)E$($episodeStr)"

        # check files in directory
        $files = Get-ChildItem -Path $outDirEp -Recurse -File | Where-Object {$_.Name -like $($outFileName)}
        if ($files.Count -eq 0)
        {
            ffmpeg -i ".\$($file.Name)" -filter:v fps=3 -q:v $($imageQuality) "$($outFileName)-%d.$($fileExtensionImageOutput)"
        }

        $episode = $episode + 1
    }
}
