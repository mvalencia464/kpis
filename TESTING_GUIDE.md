# Dashboard Export/Import Testing Guide

## Overview
This guide helps you test the improved dashboard export/import functionality.

## Prerequisites
- Valid JobTread API Grant Key
- Access to at least one JobTread organization
- Organization ID(s) for testing

## Testing Steps

### 1. Test Sample Dashboard Import
1. Open the application at http://127.0.0.1:5173/
2. Scroll down to the "Testing Helper" section
3. Click "Generate Sample Dashboard" to download a test file
4. Switch to the "Import Dashboard" tab
5. Fill in your Grant Key and Organization ID
6. Upload the generated sample file
7. Verify the import process works

### 2. Test Real Dashboard Export
1. Switch to the "Export Dashboard" tab
2. Enter your Grant Key and Organization ID
3. Click "Fetch Dashboards"
4. Select a dashboard from the dropdown
5. Click "Export Dashboard"
6. Verify the JSON file downloads correctly

### 3. Test Export-Import Cycle
1. Export a real dashboard (step 2)
2. Switch to Import tab
3. Import the exported dashboard to the same or different organization
4. Verify the dashboard is created successfully

### 4. Test Error Scenarios
1. **Invalid Credentials**: Try with wrong Grant Key or Organization ID
2. **Invalid File**: Try uploading a non-JSON file or corrupted JSON
3. **Network Issues**: Test with poor connectivity
4. **Empty Fields**: Try submitting forms with missing required fields

## Expected Behaviors

### Success Cases
- ✅ Clear success messages with specific details
- ✅ Progress indicators during API calls
- ✅ Proper file validation and feedback
- ✅ Clean form reset after successful operations

### Error Cases
- ✅ Specific error messages with guidance
- ✅ No crashes or unhandled exceptions
- ✅ Helpful suggestions for fixing issues
- ✅ Graceful degradation

## Debugging

### Development Console
- API requests and responses are logged in development mode
- Check browser console for detailed error information
- Network tab shows actual API calls and responses

### Common Issues
1. **CORS Errors**: Should be resolved with header improvements
2. **Authentication**: Verify Grant Key has necessary permissions
3. **Data Structure**: Import validation should catch malformed data
4. **Network**: Retry logic should handle temporary failures

## API Endpoints
- Base URL: `https://api.jobtread.com/pave`
- All requests use POST method with GraphQL-style queries
- Authentication via Bearer token in Authorization header

## File Format
Exported dashboards use this JSON structure:
```json
{
  "name": "Dashboard Name",
  "type": "standard",
  "tiles": [...],
  "roles": [...],
  "exportedAt": "2024-01-01T00:00:00.000Z",
  "sourceOrganizationId": "org_123",
  "exportVersion": "1.0"
}
```

## Troubleshooting
If you encounter issues:
1. Check browser console for errors
2. Verify network connectivity
3. Confirm API credentials are correct
4. Try the sample dashboard first
5. Check file format if importing fails
