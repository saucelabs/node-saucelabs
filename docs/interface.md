SauceLabs Interface
===================

The following commands are available via package or cli tool:

```sh
getJobV1_1 <id>                        Get Job Information
    <id>  job id                                                 [string] [required]
getUserConcurrency <username>          User concurrency
    <username>     username                                      [string] [required]
listUserOrganization <username>        Org information
    <username>     username                                      [string] [required]
listAvailableTunnels <username>        Get Tunnels
    <username>     username                                      [string] [required]
listBuilds <username>                  Get all of a users builds
    <username>     username                                      [string] [required]
    [limit]        Number of results to return                [number] [default: 50]
    [subaccounts]  Include subaccounts in list of jobs    [boolean] [default: false]
listJobs <username>                    Get all of a users jobs
    <username>     username                                      [string] [required]
    [limit]        Number of results to return                [number] [default: 50]
    [subaccounts]  Include subaccounts in list of jobs    [boolean] [default: false]
    [full]         Should the return result contain everything or just the basics
                                                                         [boolean]
    [manual_only]  Only return manual jobs                [boolean] [default: false]
    [name]         name of the job                                          [string]
    [owner_type]   owner type for jobs                                      [string]
    [owner]        username of owner of the jobs                            [string]
    [from]         receive jobs beginning of a specific timestamp           [number]
    [to]           receive jobs until specific timestamp                    [number]
getDashboardMessageForUser <username>  Dashboard messages from Django
    <username>     username                                      [string] [required]
listPlatforms <platform>               Appium Platform Selections
getStatus                              Sauce Labs Status
deleteManualJob <ids>                  complete manual task
    <ids>  list of task ids that to complete                              [required]
createManualJob <capabilities>         Manual job creation
    <capabilities>  desired capabilities to start the session             [required]
listManualPlatforms                    Platform list with options for desired capabilities
getManualJob <taskId>                  get manual task
    <taskId>  task id of manual task                             [string] [required]
createManualJobScreenshot <taskId>     Take screenshot in manual session
    <taskId>  task id of manual task                             [string] [required]
getCurrentUser                         Authenticated user cookie information
deleteManualJobLegacy <ids>            complete manual task
    <ids>  list of task ids that to complete                              [required]
createManualJobLegacy <capabilities>   Manual job creation
    <capabilities>  desired capabilities to start the session             [required]
getUser <username>                     User information
    <username>     username                                      [string] [required]
getUserActivity <username>             Get currently running job counts broken down by account and job status
    <username>     username                                      [string] [required]
getUserMinutes <username>              User\'s monthly-minutes
    <username>     username                                      [string] [required]
getUsersActivity                       Get job statistics for usernames
usersLastJob                           The result returns dict of usersnames and time when they started last job.
getCurrentUserFull                     Authenticated user information
listAllTunnels <username>              Get all Tunnels
    <username>     username                                      [string] [required]
listBuildFailedJobs <username> <id>    Get all of the jobs associated with a build that have failed
    <username>     username                                      [string] [required]
listBuildJobs <username> <id>          Get all of the jobs associated with a build
    <username>     username                                      [string] [required]
getJob <username> <id>                 Get Job Information
    <username>     username                                      [string] [required]
updateJob <username> <id> <body>       Update Job Information
    <username>     username                                      [string] [required]
stopJob <username> <id>                Stop Job Information
    <username>     username                                      [string] [required]
listTunnels <username> [full]          Get Tunnels
    <username>     username                                      [string] [required]
    [full]         Should the return result contain everything or just the basics
                                                                         [boolean]
deleteTunnel <username> <id>           Delete a Tunnel
    <username>     username                                      [string] [required]
getTunnel <username> <id>              Get Tunnels
    <username>     username                                      [string] [required]
    <id>        job id                                           [string] [required]
downloadJobAsset <id> <filename>       Get job asset
    <id>        job id                                           [string] [required]
    <filename>  filename                                         [string] [required]
```
