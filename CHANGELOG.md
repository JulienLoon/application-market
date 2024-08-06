# Changelog

All notable changes to this project will be documented in this file.

## [V0.10.3]

### Added
- Added: New `LogOut` component to handle user logout more efficiently. This component verifies the token and logs the user out if the token is invalid or blacklisted.
- Added: New database table `user_tokens` to store active user tokens.
- Added: New database table `blacklist_tokens` to store blacklisted tokens for enhanced security.
- Added: Validation to check if all required fields (username, password, first name, last name, email address) are filled in the `ManageUsersPage` component.
- Added: Error and warning messages for empty or invalid fields when adding or updating a user on the `ManageUsersPage` component.
- Added: Tooltips for the `BackendNavBar` and `FrontendNavBar` components, displaying helpful text below buttons on hover.
- Added: Hover effects to buttons in both `BackendNavBar` and `FrontendNavBar` components for better user experience.
- Added: Dark mode support to the Login and Register pages. Both pages now automatically adjust to the system's dark mode settings for improved user experience.
- Added: Scheduled task to delete expired tokens from the `blacklist_tokens` table every hour. The task logs the current time in the format `HH:MM` to ensure clarity on when the cron job was executed.
- Added: Time zone configuration in Dockerfile to ensure consistent time zone across different environments. The Dockerfile now sets the time zone to `Europe/Amsterdam`.
- Added: FontAwesome icons to the `Sidebar` component for a better visual representation of each menu item.

### Changed
- Improved: Token validation process to enhance security and user experience during logout.
- Improved: The `addUser` and `updateUser` functions in the `ManageUsersPage` component now include field validation, providing feedback for incomplete or incorrect user information.
- Improved: Enhanced error handling to show warnings for missing or invalid user data and email addresses in the `ManageUsersPage` component.
- Improved: Dark mode toggle functionality in `BackendNavBar` to ensure the button's appearance remains consistent.
- Improved: The cron job for deleting expired tokens now includes time-based logging to provide better insight into execution times. This change improves debugging and monitoring of token expiration.
- Improved: The cron job script now includes additional logging to confirm that cron jobs are being loaded and executed as expected.
- Changed: The RequireAuth component now checks if the token is blacklisted and removes it from local storage if invalid.
- Changed: Tooltip positioning and styling in `BackendNavBar` to ensure they appear below buttons without disrupting layout.
- Changed: Updated `FrontendNavBar` to include tooltips with descriptive text for buttons on hover.
- Changed: Increased the size of the buttons in the `Sidebar` component for better usability.
- Changed: Adjusted the styling of the `Sidebar` component to prevent text from shifting when icons are added.
- Fixed: Issue with updating isEnabled in user records to ensure proper handling and storage of boolean values.
- Fixed: Issue where updating isEnabled also changed the password of that user in the database.

### Removed
- No removals in this release.

## [V0.10.2]

### Added
- Added: Display of version and author in the `Information` section of the `BackendNavBar` component.
- Added: Register page can be toggled off. It can also be enabled in the Settings menu.
- Added: Settings page to modify app settings.
- Added: A new button on the login page: "Don't have an account yet? Register here." This button appears if the 'Register' page is enabled.
- Added: Confirmation dialog when deleting a user in the `ManageUsersPage` component.
- Added: Ability to edit user details on the `ManageUsersPage`. Fields include username, password, first name, last name, email address, and isEnabled.
- Added: New functionality to enable and disable users via the `ManageUsersPage`.
- Added: `Sidebar` component now displays a personalized greeting with both the user's first name and last name.

### Changed
- Improved: The navigation icon in the `BackendNavBar` is now clickable and leads to the backend root (`/backend`).
- Changed: The information button in the `BackendNavBar` now shows version information and author with a copyright symbol, similar to the sidebar.
- Changed: The structure and layout of the information display in the `BackendNavBar` have been updated to show version and author information.
- Improved: `ManageUsersPage` component now shows a confirmation prompt before deleting a user.
- Changed: `ManageUsersPage` component now provides an extensive form for editing user information, including fields such as username, password, first name, last name, email address, and isEnabled.
- Improved: Added a visual indication of active/inactive status on the `ManageUsersPage`.
- Improved: `Sidebar` component has been updated to display both the user's first name and last name in the greeting and profile section.

### Removed
- No removals in this release.

## [V0.10.1]

### Added
- First release of the application.

### Changed
- No changes in this initial release.

### Removed
- No removals in this initial release.
