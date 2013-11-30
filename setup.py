#!/usr/bin/pyhon

import os
import sys

# new plugins need to go here
PLUGINS = [
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git',  # Device API
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git',  # Connection
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git',  # Battery API
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git',  # Geolocation
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git',  # File API
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git',  # Network transfer
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git',  # Dialog notifications
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git',  # Vibration notifications
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git',  # Globalization
	'https://github.com/lite4cordova/Cordova-SQLitePlugin.git' #Sqlite plugin

]

DEV_PLUGINS = [
	'https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git',  # Debug console
]


# DO NOT CHANGE UNLESS PRE-DISCUSSED
INSTALL_DIR = 'pointlessbutton/'

def clean_list(raw_list):
	# parses the output from popen
	_replace_chars = ['"\n  ', '[', ']', '\'']
	for _r_c in _replace_chars:
		raw_list = raw_list.replace(_r_c, '')
	return [el.strip() for el in raw_list.split(',')]


def get_installed_plugins():
	# usable list of installed plugins
	proc = os.popen('cordova plugin ls')
	plugin_list = proc.read()
	proc.close()
	return clean_list(plugin_list)


def clean():
	# removes all installed plugins
	for plugin in get_installed_plugins():
		remove_plugin(plugin)


def remove_plugin(plugin):
	# helper for code readability
	os.system('phonegap local plugin remove ' + plugin)


def install_plugin(plugin):
	# helper for code readability
	os.system('phonegap local plugin add ' + plugin)


os.chdir(INSTALL_DIR)
user_args = sys.argv

if len(user_args) > 2:
	# No cheating
	print 'Max one option at a time'

else:
	if '--help' in user_args:
		# Displays a basic help message
		print '''
Helper utility:\n\n
$ python app_plugins_install.py [options]
  --help: displays this screen
  --build_install: installs plugins needed for a release build
  --dev_install: installs all plugins, dev included
  --clean: removes all installed plugins
  --remove: removes all plugins included in REMOVE_PLUGINS (do not use!)
'''

	elif '--build_install' in user_args:
		# Launch this when you need a release build
		clean()
		for plugin in PLUGINS:
			install_plugin(plugin)

	elif '--dev_install' in user_args:
		# Launch this while developing
		clean()
		for plugin in PLUGINS + DEV_PLUGINS:
			install_plugin(plugin)

	elif '--clean' in user_args:
		# Cleans all packages from your disk
		clean()

	elif '--remove' in user_args:
		# Removes packages selectively
		for plugin in get_installed_plugins():
			remove = raw_input('Remove {}? [y/n]: '.format(plugin))
			if remove in ['y', 'Y']:
				remove_plugin(plugin)

	else:
		# Default
		print 'Invalid option'
