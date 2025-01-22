# Submit a HTML form to Google Sheets

How to submit a simple HTML form to a Google Sheet using only HTML and JavaScript.


### 1. Set up a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet. This is where we'll store the form data.
2. Set the following headers in the first row:

|   |     A     |   B   | C | ... |
|---|:---------:|:-----:|:-:|:---:|
| 1 | Date | Email | Name   |     |


### 2. Create a Google App Script

Click on `Extensions -> Apps Script`. This will open new Google Script.

Replace the `myFunction() { ...` section with the following code snippet:

```js

const sheetName = 'Sheet1'
const scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const sheet = doc.getSheetByName(sheetName)

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    const newRow = headers.map(function(header) {
      return header === 'Date' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
```

Save the project before moving on to the next step.

### 3. Run the initialSetup function

You should see a modal asking for permissions. Click `Review permissions` and continue to the next screen.

Because this script has not been reviewed by Google, it will generate a warning before you can continue. You must click the "Go to Mailing List (Unsafe)" for the script to have the correct permissions to update your form.

After giving the script the correct permissions, you should see output.

Now your script has the correct permissions to continue to the next step.

### 4. Add a trigger for the script

Select the project "Triggers" from the sidebar and then click the `Add Trigger` button.

In the window that appears, select the following options:

- Choose which function to run: `doPost`
- Choose which deployment should run: `Head`
- Select event source: `From spreadsheet`
- Select event type: `On form submit`

Then select "Save".

### 5. Publish the project

Now your project is ready to publish. Select the `Deploy` button and `New Deployment` from the drop-down.

Click the "Select type" icon and select `Web app`. 

In the form that appears, select the following options:

- Description: `Mailing List Form` (This can be anything that you want. Just make it descriptive.)
- Web app → Execute As: `Me`
- Web app → Who has access: `Anyone`

Then click `Deploy`.

**Important:** Copy and save the web app URL before moving on to the next step.

### 6. Configure your HTML form

Create a HTML form like the source code with your google appscript url.

Now when you submit this form from any location, the data will be saved in the Google Sheet. 🥳

- **Please note:** The input names are _case sensitive_. They must match the same casing as the script. 
