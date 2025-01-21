# Changelog

All notable changes to this project will be documented in this file.

![Application Market Logo](./assets/images/Long-LOGO_Application-Market_Dark-Mode.png)

## [V0.10.4]

### Added
- Added: `FrontendNavBar` image is now clickable, leading to the homepage.
- Added: Toggle buttons with grid and list view icons in the frontend `AppList`.
- Added: `FrontendFooter` component to display metadata (version and author) on the frontend.
- Added: `Enabled Users` counter on backend dashboard.
- Added: Password visibility toggle (eye icons) to the `Login`, `Registration` and `Manage Users` page.
- Added: Placeholder `"Leave blank to keep current password"` for password input when editing users in the backend.
- Added: Filtering functionality in the `AppList` component to display apps that match the search term.
- Added: Grid and list view buttons to the `ManageAppsPage` for toggling between different display modes.
- Added: Functionality to disable users who are currently logged in through the backend, preventing their access until re-enabled.
- Added: Double confirmation prompts when attempting to delete a user account, especially when deleting the currently logged-in user's own account. Includes a secondary prompt warning that deleting their own account will log them out immediately.
- Added: Confirmation prompt when attempting to delete an app in the `ManageAppsPage`, requiring users to confirm the deletion before proceeding.
- Added: Handling for cases with no apps in the dashboard; displays "No Apps" message when there are no latest apps to show.
- Added: Search functionality in the frontend (`FrontendNavBar`) and backend navigation bar (`BackendNavBar`) with the ability to search apps.
- Added: Search bar to the `ManageAppsPage` to filter apps based on user input.

### Changed
- Changed: `ManageAppsPage` now includes grid and list view modes, allowing users to switch between a grid or list format for displaying apps.
- Improved: Dark mode detection and application in the `FrontendNavBar` to enhance visual consistency across components.
- Changed: Refactored `AppList` component to include search functionality and optimized state management.
- Changed: Backend logic now ensures the password is only updated if a new password is explicitly provided during user edits.
- Changed: Updated user deletion flow to include a confirmation dialog for deleting the currently logged-in user's account, requiring additional confirmation before proceeding with the deletion.
- Changed: Updated the backend dashboard to handle and display the "No Apps" message in the latest apps section when no apps are available.
- Improved: Conditional rendering for latest apps in the `Dashboard` component to show an appropriate message when no apps are present.
- Improved: Frontend `RegisterPage` and backend `ManageUsersPage` now handles specific error messages related to username and email address conflicts during user creation and updates.
- Improved: The `SettingsPage` now secures the update process by implementing `authenticateToken` middleware to ensure that only authenticated users can update the registration settings.

### Removed
- No removals in this release.

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
- Added: Confirmation dialog when deleting a user
