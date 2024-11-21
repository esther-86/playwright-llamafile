#!/bin/bash
# Get the absolute path of the current directory
current_path=$(dirname "$0")

# Define the file path you want to combine with the current directory
file_path="DEBUGGER-START.js"

# Combine the current directory path with the file path
full_path="${current_path}/${file_path}"
node "${full_path}"