#!/usr/bin/env node
/** ───────────────────────────────────────────────────────────ᴠɪʀᴛᴜᴀʟSᴛʏʟᴇ.ᴜs──
 * @preserve Please retain this header in any/all use(s) of this code.
 * @copyright 2025 Rob Wood <https://virtualstyle.us>
 * @license GPL-3.0-or-later GNU General Public License v3.0 or later
 *
 * @file banner.js
 * @description Displays virtualStyle's copyright and licensing information.
 * @author Rob Wood <https://rob.wood.pub><https://github.com/vswood>
 * ────────────────────────────────────────────────────────────ᴠɪʀᴛᴜᴀʟSᴛʏʟᴇ.ᴜs──
 */
import pkg from '../package.json' with { type: "json" }

/**
 * Display software name, copyright,and licensing info taken from package.json.
 * @returns {void}
 */
export const vsSplash = () => {
  const SOFTWARE_NAME = pkg && pkg.name && pkg.version ? `${pkg.name} ${pkg.version}` : 'Software by virtualStyle.us'
  const SOFTWARE_LICENSE = pkg && pkg.license ? `Licensed under ${pkg.license}` : 'UNLICENSED ALL RIGHTS RESERVED'
  const SOFTWARE_COPYRIGHT = pkg && pkg.vsMeta?.copyright || 'Copyright © 2025 Rob Wood (https://virtualstyle.us)'
  console.log('\x1b[1m══════════════════════════════════════════════════════')
	console.log(`Installing: ${SOFTWARE_NAME}`)
	console.log(SOFTWARE_COPYRIGHT)
	console.log(SOFTWARE_LICENSE)
  console.log('══════════════════════════════════════════════════════\x1b[0m')
}

vsSplash()
