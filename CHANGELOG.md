# Changelog

All notable changes to this project will be documented in this file.

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
