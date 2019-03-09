SauceLabs Interface
===================

The following commands are available via package or cli tool:

<table>
  <thead>
    <tr>
      <th width="50%">REST</td>
      <th width="50%">Node Wrapper</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        GET <code>/rest/v1.1/jobs/{id}</code><br>
        No description available.
      </td>
      <td>
        <code>api.getJobV1_1(id)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1.1/users/{username}/concurrency</code><br>
        No description available.
      </td>
      <td>
        <code>api.getUserConcurrency(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1.1/users/{username}/organization</code><br>
        No description available.
      </td>
      <td>
        <code>api.listUserOrganization(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1.1/{username}/available_tunnels</code><br>
        No description available.
      </td>
      <td>
        <code>api.listAvailableTunnels(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1.1/{username}/builds</code><br>
        No description available.
      </td>
      <td>
        <code>api.listBuilds(username, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>subaccounts</b>: Include subaccounts in list of jobs</li>          <li><b>limit</b>: Number of results to return</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1.1/{username}/jobs</code><br>
        No description available.
      </td>
      <td>
        <code>api.listJobs(username, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>auto_only</b>: FIXME ---- ?</li>          <li><b>to</b>: receive jobs until specific timestamp</li>          <li><b>from</b>: receive jobs beginning of a specific timestamp</li>          <li><b>owner</b>: username of owner of the jobs</li>          <li><b>owner_type</b>: owner type for jobs</li>          <li><b>name</b>: name of the job</li>          <li><b>limit</b>: Number of results to return</li>          <li><b>manual_only</b>: Only return manual jobs</li>          <li><b>full</b>: Should the return result contain everything or just the basics</li>          <li><b>subaccounts</b>: Include subaccounts in list of jobs</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/dashboard_messages/{username}</code><br>
        No description available.
      </td>
      <td>
        <code>api.getDashboardMessageForUser(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/info/platforms/{platform}</code><br>
        returns a list of supported platforms in the Sauce cloud
      </td>
      <td>
        <code>api.listPlatforms(platform)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/info/status</code><br>
        No description available.
      </td>
      <td>
        <code>api.getStatus()</code>
      </td>
    </tr>
    <tr>
      <td>
        DELETE <code>/rest/v1/manual</code><br>
        complete manual task
      </td>
      <td>
        <code>api.deleteManualJob(ids)</code>
      </td>
    </tr>
    <tr>
      <td>
        POST <code>/rest/v1/manual</code><br>
        Creates a manual job
      </td>
      <td>
        <code>api.createManualJob(capabilities)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/manual/options/</code><br>
        returns a list of supported platforms in the Sauce cloud
      </td>
      <td>
        <code>api.listManualPlatforms()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/manual/{taskId}</code><br>
        get manual task
      </td>
      <td>
        <code>api.getManualJob(taskId)</code>
      </td>
    </tr>
    <tr>
      <td>
        POST <code>/rest/v1/manual/{taskId}/screenshot</code><br>
        Take screenshot in manual session
      </td>
      <td>
        <code>api.createManualJobScreenshot(taskId)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/me</code><br>
        No description available.
      </td>
      <td>
        <code>api.getCurrentUser()</code>
      </td>
    </tr>
    <tr>
      <td>
        DELETE <code>/rest/v1/tasks</code><br>
        complete manual task
      </td>
      <td>
        <code>api.deleteManualJobLegacy(ids)</code>
      </td>
    </tr>
    <tr>
      <td>
        POST <code>/rest/v1/tasks</code><br>
        Creates a manual job
      </td>
      <td>
        <code>api.createManualJobLegacy(capabilities)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/users/{username}</code><br>
        No description available.
      </td>
      <td>
        <code>api.getUser(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/users/{username}/activity</code><br>
        No description available.
      </td>
      <td>
        <code>api.getUserActivity(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/users/{username}/monthly-minutes</code><br>
        No description available.
      </td>
      <td>
        <code>api.getUserMinutes(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/users_activity</code><br>
        No description available.
      </td>
      <td>
        <code>api.getUsersActivity()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/users_last_job</code><br>
        No description available.
      </td>
      <td>
        <code>api.usersLastJob()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/whoami</code><br>
        No description available.
      </td>
      <td>
        <code>api.getCurrentUserFull()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/{username}/all_tunnels</code><br>
        No description available.
      </td>
      <td>
        <code>api.listAllTunnels(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/{username}/builds/{id}/failed-jobs</code><br>
        No description available.
      </td>
      <td>
        <code>api.listBuildFailedJobs(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/{username}/builds/{id}/jobs</code><br>
        No description available.
      </td>
      <td>
        <code>api.listBuildJobs(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/{username}/jobs/{id}</code><br>
        No description available.
      </td>
      <td>
        <code>api.getJob(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/rest/v1/{username}/jobs/{id}</code><br>
        No description available.
      </td>
      <td>
        <code>api.updateJob(username, id, body)</code>
      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/rest/v1/{username}/jobs/{id}/stop</code><br>
        No description available.
      </td>
      <td>
        <code>api.stopJob(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/{username}/tunnels</code><br>
        No description available.
      </td>
      <td>
        <code>api.listTunnels(username, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>full</b>: Should the return result contain everything or just the basics</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        DELETE <code>/rest/v1/{username}/tunnels/{id}</code><br>
        No description available.
      </td>
      <td>
        <code>api.deleteTunnel(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/{username}/tunnels/{id}</code><br>
        No description available.
      </td>
      <td>
        <code>api.getTunnel(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/rest/v1/jobs/{id}/{assetName}</code><br>
        No description available.
      </td>
      <td>
        <code>api.downloadJobAsset(id, filename)</code>
      </td>
    </tr>
    <tr>
      <td>
        POST <code>/storage/upload</code><br>
        Returns new application id after the upload.
      </td>
      <td>
        <code>api.uploadApp(, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>App-Active</b>: If true makes uploaded application active one</li>          <li><b>App-DisplayName</b>: Your custom display name</li>          <li><b>App-Identifier</b>: Your custom unique identifier for your app</li>          <li><b>App-Type</b>: Application type</li>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v1/appium/session/{sessionId}/skiptest</code><br>
        Report the result of a test as skipped.
      </td>
      <td>
        <code>api.markTestAsSkippedDeprecated(sessionId)</code>
      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v1/appium/session/{sessionId}/test</code><br>
        Report the result of a test.
      </td>
      <td>
        <code>api.updateTestDeprecated(sessionId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v1/appium/suites/{batchId}</code><br>
        Updates the properties of a suite.
      </td>
      <td>
        <code>api.updateSuiteDeprecated(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/appium/suites/{batchId}/deviceIds</code><br>
        Returns the IDs of the devices which you had selected for the specified suite.
      </td>
      <td>
        <code>api.readDeviceIdsDeprecated(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        POST <code>/v1/appium/suites/{batchId}/reports/start</code><br>
        Start a new suite execution including its test executions.
      </td>
      <td>
        <code>api.startSuiteDeprecated(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>appId</b>: The ID of the app version you wish to test</li>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v1/appium/suites/{batchId}/reports/{batchReportId}/finish</code><br>
        Marks all test executions contained in the specified suite execution as finished.
      </td>
      <td>
        <code>api.finishSuiteDeprecated(suiteId, batchReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v1/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/finish</code><br>
        Sets the status of the specific test execution and marks it as finished.
      </td>
      <td>
        <code>api.finishTestReportDeprecated(suiteId, suiteReportId, testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v1/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/skip</code><br>
        Mark test execution as skipped
      </td>
      <td>
        <code>api.skipTestReportDeprecated(suiteId, suiteReportId, testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices</code><br>
        Returns a list containing all devices, including those not currently available for testing
      </td>
      <td>
        <code>api.getDescriptorsDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices/all</code><br>
        Returns a list containing all devices, including those not currently unavailable for testing.
This endpoint requires API Key authentication and will also return your private devices.
      </td>
      <td>
        <code>api.getDescriptorsApiDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices/all/available</code><br>
        Returns a list containing the IDs of all devices currently available for testing.
This endpoint requires API Key authentication and will also return your private devices.
      </td>
      <td>
        <code>api.getAvailableDescriptorIdsApiDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices/available</code><br>
        Returns a list containing the IDs of all devices currently available for testing
      </td>
      <td>
        <code>api.getAvailableDescriptorIdsDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices/reports</code><br>
        The session history reports provide information about user sessions. This includes device usage and test reports. By default reports of the last 30 days will be retrieved - limited to a maximum of 50 reports.
If the authenticated user is the owner of the account, session reports of the entire team will be retrieved. Team members can only retrieve their own session history. This endpoint requires Password authentication.
      </td>
      <td>
        <code>api.getSessionReports(, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>limit</b>: Max number of results per page</li>          <li><b>offset</b>: Offset for pagination</li>          <li><b>lastDays</b>: Number of days to report</li>          <li><b>userId</b>: Your username.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices/{deviceDescriptorId}</code><br>
        Returns information for a particular device.
This endpoint requires API Key authentication.
      </td>
      <td>
        <code>api.getDescriptorDeprecated(deviceId)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v1/devices/{deviceDescriptorId}/status</code><br>
        Returns a list containing device status infos for all device instances with the specified device ID on all pools.
This endpoint requires API Key authentication and will also return your private devices.
      </td>
      <td>
        <code>api.getDeviceStatusInfosDeprecated(deviceId)</code>
      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v2/appium/session/{sessionId}/skiptest</code><br>
        Report the result of a test as skipped.
      </td>
      <td>
        <code>api.markTestAsSkipped(sessionId)</code>
      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v2/appium/session/{sessionId}/test</code><br>
        Report the result of a test.
      </td>
      <td>
        <code>api.updateTest(sessionId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v2/appium/suites/{batchId}</code><br>
        Updates the properties of a suite.
      </td>
      <td>
        <code>api.updateSuite(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/appium/suites/{batchId}/deviceIds</code><br>
        Returns the IDs of the devices which you had selected for the specified suite.
      </td>
      <td>
        <code>api.readDeviceIds(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        POST <code>/v2/appium/suites/{batchId}/reports/start</code><br>
        Start a new suite execution including its test executions.
      </td>
      <td>
        <code>api.startSuite(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>appId</b>: The ID of the app version you wish to test</li>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v2/appium/suites/{batchId}/reports/{batchReportId}/finish</code><br>
        Marks all test executions contained in the specified suite execution as finished.
      </td>
      <td>
        <code>api.finishSuite(suiteId, batchReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v2/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/finish</code><br>
        Sets the status of the specific test execution and marks it as finished.
      </td>
      <td>
        <code>api.finishTestReport(suiteId, suiteReportId, testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        PUT <code>/v2/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/skip</code><br>
        Mark test execution as skipped
      </td>
      <td>
        <code>api.skipTestReport(suiteId, suiteReportId, testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/batchReports/{batchReportId}</code><br>
        Returns the test report of a suite
      </td>
      <td>
        <code>api.readBatchReport(, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/batchReports/{batchReportId}/xml</code><br>
        Returns the test report of a suite as XML
      </td>
      <td>
        <code>api.junitStyleXmlReport(, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/devices</code><br>
        Returns a list per data center containing all devices, including private devices and those not currently available for testing. This endpoint requires API Key authentication.
      </td>
      <td>
        <code>api.getDescriptors()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/devices/available</code><br>
        Returns a list per data center containing the IDs of all devices currently available for testing, including private devices. This endpoint requires API Key authentication.
      </td>
      <td>
        <code>api.getAvailableDescriptorIds()</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/devices/{deviceDescriptorId}</code><br>
        Returns information for a particular device per data center. This endpoint requires API Key authentication.
      </td>
      <td>
        <code>api.getDescriptor(deviceId)</code>
      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/logs/{testReportId}/appium</code><br>
        Returns Appium log for the specified test report
      </td>
      <td>
        <code>api.readAppiumLog(testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/logs/{testReportId}/device</code><br>
        Returns device log for the specified test report
      </td>
      <td>
        <code>api.readDeviceLog(testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/logs/{testReportId}/vitals</code><br>
        Returns device vitals of a test session after completion
      </td>
      <td>
        <code>api.readVitalsLog(testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/logs/{testReportId}/xcuitest</code><br>
        Returns XCUITest log for the specified test report
      </td>
      <td>
        <code>api.readXcuiTestLog(testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/reports/{testReportId}</code><br>
        Returns test report and artifacts for a test session after completion
      </td>
      <td>
        <code>api.readReport(testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/screenshots/{testReportId}/{screenshotId}.png</code><br>
        Returns a PNG screenshot from a test
      </td>
      <td>
        <code>api.getScreenshot(testReportId, screenshotId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        GET <code>/v2/video/{videoId}.mp4</code><br>
        Returns screen recording of a test session after completion
      </td>
      <td>
        <code>api.getScreenRecording(videoId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Authorization</b>: Authorization header for authentication</li>          <li><b>Range</b>: No description available.</li>        </ul>      </td>
    </tr>
  </tbody></table>