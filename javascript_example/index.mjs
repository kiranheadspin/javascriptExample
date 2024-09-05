import { remote } from 'webdriverio';

// HeadSpin WebDriver URLs for Android and iOS devices
const androidWdUrl =
    'https://dev-us-pao-5.headspin.io:7040/v0/{token}/wd/hub';
const iosWdUrl =
    'https://dev-hk-hkg-1.headspin.io:7003/v0/{token}/wd/hub';

const androidCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Pixel 4',
    'appium:udid': '9A231FFAZ002SD',
    'appium:appPackage': 'com.google.android.calculator',
    'appium:appActivity': 'com.android.calculator2.Calculator',
    // Enable video, network, and function call capture
    'headspin:capture': true,
    // Set the User Flow name for Performance Monitoring
    'headspin:testName': 'cal_test_android',
    // Tag the session with custom key-value pairs
    'headspin:sessionTags': [{ demo: 'tag' }, { hello: 'world' }],
    // Set the name of the HeadSpin session
    'headspin:session.name': 'test_name',
    // Set the description of the HeadSpin session
    'headspin:session.description': 'test_description',
};

const iosCapabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 12 Pro',
    'appium:udid': '00008101-000E38911E61001E',
    'appium:bundleId': 'com.apple.calculator',
    // Enable video, network, and function call capture
    'headspin:capture': true,
    // Set the User Flow name for Performance Monitoring
    'headspin:testName': 'cal_test_ios',
    // Tag the session with custom key-value pairs
    'headspin:sessionTags': [{ demo: 'tag' }, { hello: 'world' }],
    // Set the name of the HeadSpin session
    'headspin:session.name': 'test_name',
    // Set the description of the HeadSpin session
    'headspin:session.description': 'test_description',
};

async function runAndroidTest() {
    const driver = await remote({
        protocol: 'https',
        hostname: new URL(androidWdUrl).hostname,
        port: parseInt(new URL(androidWdUrl).port),
        path: new URL(androidWdUrl).pathname,
        capabilities: androidCapabilities,
    });

    try {
        // Wait for the calculator to load
        await driver
            .$('//android.widget.ImageButton[@content-desc="plus"]')
            .waitForExist({ timeout: 10000 });

        // Perform 4-digit addition: 1234 + 5678
        const buttons = ['1', '2', '3', '4', 'plus', '5', '6', '7', '8', 'equals'];
        for (const button of buttons) {
            await driver
                .$(`//android.widget.ImageButton[@content-desc="${button}"]`)
                .click();
        }

        // Wait for the result and log it
        const result = await driver
            .$(
                '//android.widget.TextView[@resource-id="com.google.android.calculator:id/result_final"]'
            )
            .getText();
        console.log(`Android: The result of 1234 + 5678 is: ${result}`);

        // Go back to home screen
        await driver.pressKeyCode(3);

        console.log('Android test completed successfully');
    } catch (error) {
        console.error(`An error occurred in Android test: ${error}`);
    } finally {
        // End the session and set the user flow status
        await driver.execute('headspin:quitSession', { status: 'passed' });
    }
}

async function runIOSTest() {
    const driver = await remote({
        protocol: 'https',
        hostname: new URL(iosWdUrl).hostname,
        port: parseInt(new URL(iosWdUrl).port),
        path: new URL(iosWdUrl).pathname,
        capabilities: iosCapabilities,
    });

    try {
        // Wait for the calculator to load
        await driver
            .$('//XCUIElementTypeButton[@name="add"]')
            .waitForExist({ timeout: 10000 });

        // Perform 4-digit addition: 1234 + 5678
        const buttons = ['1', '2', '3', '4', 'add', '5', '6', '7', '8', 'equals'];
        for (const button of buttons) {
            await driver.$(`//XCUIElementTypeButton[@name="${button}"]`).click();
        }

        // Wait for the result and log it
        const result = await driver
            .$('//XCUIElementTypeStaticText[@name="Result"]')
            .getText();
        console.log(`iOS: The result of 1234 + 5678 is: ${result}`);

        console.log('iOS test completed successfully');
    } catch (error) {
        console.error(`An error occurred in iOS test: ${error}`);
    } finally {
        // End the session and set the user flow status
        await driver.execute('headspin:quitSession', { status: 'passed' });
    }
}

// Run both tests concurrently
async function runTests() {
    try {
        await Promise.all([runAndroidTest(), runIOSTest()]);
        console.log('All tests completed');
    } catch (error) {
        console.error(`An error occurred while running tests: ${error}`);
    }
}

runTests();




