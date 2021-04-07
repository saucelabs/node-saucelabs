SauceLabs Interface
===================

The following commands are available via package or cli tool:

<table>
  <tbody>
    <tr>
      <td>
        <b>GET</b> <code>/v1.1/jobs/{id}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getJobV1_1(id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1.2/users/{username}/concurrency</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getUserConcurrency(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1.1/users/{username}/organization</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listUserOrganization(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1.1/{username}/available_tunnels</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listAvailableTunnels(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1.1/{username}/builds</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listBuilds(username, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>limit</b>: Number of results to return</li>          <li><b>subaccounts</b>: Include subaccounts in list of jobs</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1.1/{username}/jobs</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listJobs(username, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>limit</b>: Number of results to return</li>          <li><b>subaccounts</b>: Include subaccounts in list of jobs</li>          <li><b>full</b>: Should the return result contain everything or just the basics</li>          <li><b>manual_only</b>: Only return manual jobs</li>          <li><b>auto_only</b>: No description available.</li>          <li><b>name</b>: name of the job</li>          <li><b>owner_type</b>: owner type for jobs</li>          <li><b>owner</b>: username of owner of the jobs</li>          <li><b>from</b>: receive jobs beginning of a specific timestamp</li>          <li><b>to</b>: receive jobs until specific timestamp</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/dashboard_messages/{username}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getDashboardMessageForUser(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/info/platforms/{platform}</code><br>
        returns a list of supported platforms in the Sauce cloud
        <h3>Example:</h3>
        <code>api.listPlatforms(platform)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/info/status</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getStatus()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>DELETE</b> <code>/v1/manual</code><br>
        complete manual task
        <h3>Example:</h3>
        <code>api.deleteManualJob(ids)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/manual</code><br>
        Creates a manual job
        <h3>Example:</h3>
        <code>api.createManualJob(capabilities)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/manual/options/</code><br>
        returns a list of supported platforms in the Sauce cloud
        <h3>Example:</h3>
        <code>api.listManualPlatforms()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/manual/{taskId}</code><br>
        get manual task
        <h3>Example:</h3>
        <code>api.getManualJob(taskId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/manual/{taskId}/screenshot</code><br>
        Take screenshot in manual session
        <h3>Example:</h3>
        <code>api.createManualJobScreenshot(taskId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/me</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getCurrentUser()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>DELETE</b> <code>/v1/tasks</code><br>
        complete manual task
        <h3>Example:</h3>
        <code>api.deleteManualJobLegacy(ids)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/tasks</code><br>
        Creates a manual job
        <h3>Example:</h3>
        <code>api.createManualJobLegacy(capabilities)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/users/{username}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getUser(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/users/{username}/subaccounts</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getSubaccounts(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/users/{username}/activity</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getUserActivity(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/users/{username}/monthly-minutes</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getUserMinutes(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/users_activity</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getUsersActivity()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/users_last_job</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.usersLastJob()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/whoami</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getCurrentUserFull()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/{username}/all_tunnels</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listAllTunnels(username)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/{username}/builds/{id}/failed-jobs</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listBuildFailedJobs(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/builds/{id}/jobs</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listBuildJobs(id, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>full</b>: Should the return result contain everything or just the basics</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/{username}/jobs/{id}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getJob(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/{username}/jobs/{id}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.updateJob(username, id, body)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/{username}/jobs/{id}/stop</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.stopJob(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/{username}/tunnels</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.listTunnels(username, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>full</b>: Should the return result contain everything or just the basics</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>DELETE</b> <code>/v1/{username}/tunnels/{id}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.deleteTunnel(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/{username}/tunnels/{id}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getTunnel(username, id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/jobs/{id}/{assetName}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.downloadJobAsset(id, filename, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>filepath</b>: file path to store the asset at</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/storage/upload</code><br>
        Returns new application id after the upload.
        <h3>Example:</h3>
        <code>api.uploadApp({ ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>App-Type</b>: Application type</li>          <li><b>App-Identifier</b>: Your custom unique identifier for your app</li>          <li><b>App-DisplayName</b>: Your custom display name</li>          <li><b>App-Active</b>: If true makes uploaded application active one</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/appium/session/{sessionId}/skiptest</code><br>
        Report the result of a test as skipped.
        <h3>Example:</h3>
        <code>api.markTestAsSkippedDeprecated(sessionId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/appium/session/{sessionId}/test</code><br>
        Report the result of a test.
        <h3>Example:</h3>
        <code>api.updateTestDeprecated(sessionId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/appium/suites/{batchId}</code><br>
        Updates the properties of a suite.
        <h3>Example:</h3>
        <code>api.updateSuiteDeprecated(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/appium/suites/{batchId}/deviceIds</code><br>
        Returns the IDs of the devices which you had selected for the specified suite.
        <h3>Example:</h3>
        <code>api.readDeviceIdsDeprecated(suiteId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/appium/suites/{batchId}/reports/start</code><br>
        Start a new suite execution including its test executions.
        <h3>Example:</h3>
        <code>api.startSuiteDeprecated(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>appId</b>: The ID of the app version you wish to test</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/appium/suites/{batchId}/reports/{batchReportId}/finish</code><br>
        Marks all test executions contained in the specified suite execution as finished.
        <h3>Example:</h3>
        <code>api.finishSuiteDeprecated(suiteId, batchReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/finish</code><br>
        Sets the status of the specific test execution and marks it as finished.
        <h3>Example:</h3>
        <code>api.finishTestReportDeprecated(suiteId, suiteReportId, testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v1/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/skip</code><br>
        Mark test execution as skipped
        <h3>Example:</h3>
        <code>api.skipTestReportDeprecated(suiteId, suiteReportId, testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices</code><br>
        Returns a list containing all devices, including those not currently available for testing
        <h3>Example:</h3>
        <code>api.getDescriptorsDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices/all</code><br>
        Returns a list containing all devices, including those not currently unavailable for testing.
This endpoint requires API Key authentication and will also return your private devices.
        <h3>Example:</h3>
        <code>api.getDescriptorsApiDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices/all/available</code><br>
        Returns a list containing the IDs of all devices currently available for testing.
This endpoint requires API Key authentication and will also return your private devices.
        <h3>Example:</h3>
        <code>api.getAvailableDescriptorIdsApiDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices/available</code><br>
        Returns a list containing the IDs of all devices currently available for testing
        <h3>Example:</h3>
        <code>api.getAvailableDescriptorIdsDeprecated()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices/reports</code><br>
        The session history reports provide information about user sessions. This includes device usage and test reports. By default reports of the last 30 days will be retrieved - limited to a maximum of 50 reports.
If the authenticated user is the owner of the account, session reports of the entire team will be retrieved. Team members can only retrieve their own session history. This endpoint requires Password authentication.
        <h3>Example:</h3>
        <code>api.getSessionReports({ ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>userId</b>: Your username.</li>          <li><b>lastDays</b>: Number of days to report</li>          <li><b>offset</b>: Offset for pagination</li>          <li><b>limit</b>: Max number of results per page</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices/{deviceDescriptorId}</code><br>
        Returns information for a particular device.
This endpoint requires API Key authentication.
        <h3>Example:</h3>
        <code>api.getDescriptorDeprecated(deviceId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/devices/{deviceDescriptorId}/status</code><br>
        Returns a list containing device status infos for all device instances with the specified device ID on all pools.
This endpoint requires API Key authentication and will also return your private devices.
        <h3>Example:</h3>
        <code>api.getDeviceStatusInfosDeprecated(deviceId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v2/appium/session/{sessionId}/skiptest</code><br>
        Report the result of a test as skipped.
        <h3>Example:</h3>
        <code>api.markTestAsSkipped(sessionId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v2/appium/session/{sessionId}/test</code><br>
        Report the result of a test.
        <h3>Example:</h3>
        <code>api.updateTest(sessionId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v2/appium/suites/{batchId}</code><br>
        Updates the properties of a suite.
        <h3>Example:</h3>
        <code>api.updateSuite(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/appium/suites/{batchId}/deviceIds</code><br>
        Returns the IDs of the devices which you had selected for the specified suite.
        <h3>Example:</h3>
        <code>api.readDeviceIds(suiteId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v2/appium/suites/{batchId}/reports/start</code><br>
        Start a new suite execution including its test executions.
        <h3>Example:</h3>
        <code>api.startSuite(suiteId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>appId</b>: The ID of the app version you wish to test</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v2/appium/suites/{batchId}/reports/{batchReportId}/finish</code><br>
        Marks all test executions contained in the specified suite execution as finished.
        <h3>Example:</h3>
        <code>api.finishSuite(suiteId, batchReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v2/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/finish</code><br>
        Sets the status of the specific test execution and marks it as finished.
        <h3>Example:</h3>
        <code>api.finishTestReport(suiteId, suiteReportId, testReportId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/v2/appium/suites/{batchId}/reports/{batchReportId}/results/{testReportId}/skip</code><br>
        Mark test execution as skipped
        <h3>Example:</h3>
        <code>api.skipTestReport(suiteId, suiteReportId, testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/batchReports/{batchReportId}</code><br>
        Returns the test report of a suite
        <h3>Example:</h3>
        <code>api.readBatchReport({ ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/batchReports/{batchReportId}/xml</code><br>
        Returns the test report of a suite as XML
        <h3>Example:</h3>
        <code>api.junitStyleXmlReport({ ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>body</b>: No description available.</li>          <li><b>body</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/devices</code><br>
        Returns a list per data center containing all devices, including private devices and those not currently available for testing. This endpoint requires API Key authentication.
        <h3>Example:</h3>
        <code>api.getDescriptors()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/devices/available</code><br>
        Returns a list per data center containing the IDs of all devices currently available for testing, including private devices. This endpoint requires API Key authentication.
        <h3>Example:</h3>
        <code>api.getAvailableDescriptorIds()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/devices/{deviceDescriptorId}</code><br>
        Returns information for a particular device per data center. This endpoint requires API Key authentication.
        <h3>Example:</h3>
        <code>api.getDescriptor(deviceId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/logs/{testReportId}/appium</code><br>
        Returns Appium log for the specified test report
        <h3>Example:</h3>
        <code>api.readAppiumLog(testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/logs/{testReportId}/device</code><br>
        Returns device log for the specified test report
        <h3>Example:</h3>
        <code>api.readDeviceLog(testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/logs/{testReportId}/vitals</code><br>
        Returns device vitals of a test session after completion
        <h3>Example:</h3>
        <code>api.readVitalsLog(testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/logs/{testReportId}/xcuitest</code><br>
        Returns XCUITest log for the specified test report
        <h3>Example:</h3>
        <code>api.readXcuiTestLog(testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/reports/{testReportId}</code><br>
        Returns test report and artifacts for a test session after completion
        <h3>Example:</h3>
        <code>api.readReport(testReportId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/screenshots/{testReportId}/{screenshotId}.png</code><br>
        Returns a PNG screenshot from a test
        <h3>Example:</h3>
        <code>api.getScreenshot(testReportId, screenshotId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v2/video/{videoId}.mp4</code><br>
        Returns screen recording of a test session after completion
        <h3>Example:</h3>
        <code>api.getScreenRecording(videoId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>Range</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/</code><br>
        Provides a list of paginated raw performance metrics for the logged user
        <h3>Example:</h3>
        <code>api.getPerformanceMetrics({ ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>page_url</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/</code><br>
        Provides performance metrics and job basic data for a given job_id
        <h3>Example:</h3>
        <code>api.getPerformanceMetricsByJobId(job_id, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>full</b>: When set to false, basic job data will be returned, excluding performance metrics</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/assert/</code><br>
        Provides information if there is an outlier for the given job_id and metric
        <h3>Example:</h3>
        <code>api.assertPerformance(job_id, metric_names, order_index)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/baseline/</code><br>
        Provides baseline based on metrics history, where the reference point is a given job_id
        <h3>Example:</h3>
        <code>api.getBaseline(job_id, metric_names, order_index, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>regime_start</b>: No description available.</li>          <li><b>regime_end</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/baseline/reset/</code><br>
        Returns true if a baseline was resetted for a give job_id
        <h3>Example:</h3>
        <code>api.hasBaselineReset(job_id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/metrics/{job_id}/baseline/reset/</code><br>
        Sets a reset point market at job_id, previous jobs will not be taken into account in calculating baseline
        <h3>Example:</h3>
        <code>api.acknowledgeBaseline(job_id)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/discarded/</code><br>
        Provides lists outliers marked as discarded
        <h3>Example:</h3>
        <code>api.getDiscardedOutliers(job_id, order_index)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/metrics/{job_id}/discarded/</code><br>
        Marks outlier for a given {job_id} as not relevant/flaky
        <h3>Example:</h3>
        <code>api.discardOutliers(job_id, order_index)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/history/</code><br>
        Provides a list of raw performance metrics up to point where the reference is a given job_id and order_index
        <h3>Example:</h3>
        <code>api.getBaselineHistory(job_id, order_index, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>limit</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/{job_id}/regimes/</code><br>
        Provides regimes per metric calculated for a set of jobs, where the reference point is a given job_id
        <h3>Example:</h3>
        <code>api.getRegimes(job_id, metric_names, order_index, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>include_baseline</b>: No description available.</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/metrics/{job_id}/regimes/acknowledge/</code><br>
        Acknowledge regime. Confirm values in new regime are acceptable.
        <h3>Example:</h3>
        <code>api.acknowledgeRegime(job_id, order_index)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/metrics/swagger/</code><br>
        Provides json documentation for the performance API
        <h3>Example:</h3>
        <code>api.getApiDefinition()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>PUT</b> <code>/jobs/{jobId}/assets</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.uploadJobAssets(jobId, { ...options })</code>
        <br><h4>Options</h4>
        <ul>          <li><b>files</b>: asset to upload and attach to your job</li>        </ul>      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/reports</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.createJob(parameters)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/</code><br>
        create test result job via data store
        <h3>Example:</h3>
        <code>api.createResultJob(parameters)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/getprojects</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getProjects()</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/projects/{projectId}/getproject</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getProject(projectId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/projects/{projectName}/getprojectbyname</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getProjectByName(projectName)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/testSuites/{accountId}/{projectId}/getTestSuites</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getTestsuitesByProjects(projectId, accountId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/projects/{projectId}/testcases/{testcaseId}/updateLveAndRecoverSteps</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.updateLveAndRecoverSteps(projectId, testcaseId, steps)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/projects/{projectId}/execute</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.executeTestsuiteTest(Body, projectId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/testsuite/{testSuiteId}/execute</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.executeTestsuite(testSuiteId, Body)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>POST</b> <code>/v1/auth</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getAuth(Body)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/jobs/{jobId}/get_status</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getExecutionStatus(jobId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/projects/{projectId}/testcases</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getTestcases(projectId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/testCases/getTestCaseInfo/{testcaseId}/{stepId}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getTestSteps(testcaseId, stepId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/blocks/getAll/{accountId}/{blockId}</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getTestStepBlocks(accountId, blockId)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/v1/downloadFile</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.downloadReport(fileURL)</code>
      </td>
    </tr>
    <tr>
      <td>
        <b>GET</b> <code>/testScriptExecutions/{executionId}/executions</code><br>
        No description available.
        <h3>Example:</h3>
        <code>api.getExecutions(executionId)</code>
      </td>
    </tr>
  </tbody></table>