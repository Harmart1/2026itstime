# Display QA notes

This build consolidates the responsive display rules and removes the older device-detection dependency.

Test widths used for the layout rules:
- desktop: 1180 px and above
- compact desktop / tablet: 861–1179 px
- tablet / small laptop: 641–860 px
- mobile: 640 px and below

Key safeguards:
- no horizontal page overflow
- mobile menu anchors to the bottom of the sticky header
- contribution and volunteer forms collapse to one column before fields become cramped
- contribution text and email addresses can wrap safely
- the lawn-sign artwork has no text overlay
- sticky mobile actions are hidden while the contribution section is in view

The site remains framework-free and uses ordinary HTML, CSS and JavaScript.
