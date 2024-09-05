package utils;

import io.appium.java_client.AppiumDriver;
import lib.hsApi;
import lib.sessionVisual;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Parameters;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


public class basic {
    public static AppiumDriver driver = null;
    public static WebDriverWait wait = null;
    public static WebDriverWait waitShort = null;
    public String test_status="Test Failed";
    public String sessionId;
    String token ;
    private hsApi hs_Api_APi;
    public  Logger logger;
    public HashMap<String, Double> SearchTime = new HashMap<>();
    public static HashMap<String, Object> kpiLabels = new HashMap<>();
    public static sessionVisual Session_Visual;


    @Parameters({"udid","url"})
    @BeforeTest
    public void BasicInitializer(String udid, String url) throws IOException, InterruptedException {
        String appiumUrl = url;

        DesiredCapabilities desiredCapabilities = new DesiredCapabilities();
        desiredCapabilities.setCapability("udid",udid);
        desiredCapabilities.setCapability("automationName","xcuitest");
        desiredCapabilities.setCapability("headspin:capture.video","true");
        desiredCapabilities.setCapability("platformName","ios");
        desiredCapabilities.setCapability("platformVersion","15.6");
        desiredCapabilities.setCapability("deviceName","iPhone XR");
        desiredCapabilities.setCapability("bundleId","{bundle_id}");
        desiredCapabilities.setCapability("noReset", false);
        desiredCapabilities.setCapability("appium:autoAcceptAlerts", true);
        desiredCapabilities.setCapability("headspin:testName", "Sharechat");
        driver = new AppiumDriver(new URL(appiumUrl),desiredCapabilities);
        sessionId = String.valueOf(driver.getSessionId());
        wait = new WebDriverWait(driver, Duration.ofSeconds(50));
        waitShort = new WebDriverWait(driver, Duration.ofSeconds(10));
        token = "{access_token}";
        hs_Api_APi = new hsApi(token);
        kpiLabels = new HashMap<>();
        Session_Visual = new sessionVisual(token, this.sessionId);
        logger = Logger.getLogger(basic.class.getName());
    }

    @AfterTest
    public void tearDown() throws Exception {

        String status = test_status.equals("Passed") ? "Passed" : "Failed";
        Map<String, String> statusUpdate = new HashMap<String, String>();
        logger.info("Status : " + status);
        statusUpdate.put("status", status);
        Map<String, String> sessionDescription = new HashMap<String, String>();
        sessionDescription.put("name", "project_name");
        sessionDescription.put("description", "This is a sample java test");
        Map<String, String> userFlow = new HashMap<String, String>();
        userFlow.put("test_name","project_name");
        userFlow.put("session_id",sessionId);
        driver.executeScript("headspin:quitSession", statusUpdate);

        if (!sessionId.equals("None")) {
            Thread.sleep(4000);
            hs_Api_APi.sessionData(userFlow);
            hs_Api_APi.updateDescription(sessionDescription, sessionId);
            Session_Visual.PageLoad(kpiLabels);
            logger.info("https://ui.headspin.io/sessions/" + sessionId +  "/waterfall");
        }
    }
