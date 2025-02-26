#!/usr/bin/env bash
#
# Usage:
#   ./create_user.sh <USERNAME> <EMAIL> <PASSWORD>
#
# Example:
#   ./create_user.sh jane jane@example.com MyS3cur3P@ssw0rd
#
# This script:
# 1. Creates a user via tootctl.
# 2. Sets the password via the Rails runner command.

# ----- Adjust these if needed -----
MASTODON_DIR="/home/mastodon_source/bin"  # Path to your Mastodon installation
# ----------------------------------

# Read input arguments
USERNAME="$1"
USEREMAIL="$2"
PASSWORD="$3"

# Check if all parameters are supplied
if [ -z "$USERNAME" ] || [ -z "$USEREMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Usage: $0 <USERNAME> <EMAIL> <PASSWORD>"
  exit 1
fi

# If RAILS_ENV is not set, default to 'development'
: "${RAILS_ENV:=development}"

# Move to your Mastodon directory
cd "$MASTODON_DIR" || {
  echo "Could not change directory to $MASTODON_DIR"
  exit 1
}

# 1. Create the user (confirmed so no email link is needed)
./tootctl accounts create "$USERNAME" \
  --email="$USEREMAIL" \
  --confirmed || {
    echo "Error: Failed to create user '$USERNAME'."
    exit 1
  }

echo "Approving user '$USERNAME'..."
./tootctl accounts modify "$USERNAME" --approve || {
  echo "Error: Failed to approve user '$USERNAME'."
  exit 1
}

# 2. Immediately set the user's password via Rails runner
./rails runner "
  account = Account.find_by!(username: '$USERNAME')
  account.user.password = '$PASSWORD'
  account.user.password_confirmation = '$PASSWORD'
  account.user.save!
" || {
  echo "Error: Failed to set password for user '$USERNAME'."
  exit 1
}

echo "User '$USERNAME' created with email '$USEREMAIL' and password set."
