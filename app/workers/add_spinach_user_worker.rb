# add new user to Mastodon
class AddSpinachUserWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'spinach-users'

  def perform(user_id, email)
    user = User.new(username: user_id, email: email, confirmed_at: Time.now)

    if user.save
      Rails.logger.info "User '#{user_id}' created successfully."
      approve_user(user_id)
    else
      raise "Error: Failed to create user '#{user_id}'."
    end
  end

  private

  def approve_user(username)
    user = User.find_by(username: username)
    if user
      password = SecureRandom.hex(8)
      user.update(approved: true, password: password, password_confirmation: password)
      Rails.logger.info "User '#{username}' approved successfully with password '#{password}'."
    else
      Rails.logger.error "Error: User '#{username}' not found."
      raise "Error: User '#{username}' not found."
    end
  end

end