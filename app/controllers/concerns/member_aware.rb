
module MemberAware
  extend ActiveSupport::Concern

  included do
    before_action :recognized_member
  end

  def current_member
    @current_member ||= member_from_jwt
  end

  def recognized_member
    @recognized_member ||= current_member || member_from_cookie
  end

  def write_member_cookie(member_id)
    cookies.signed[:member_id] = {
      value: member_id,
      expires: 2.years.from_now,
      domain: :all,
      tld_length: 1
    }
  end

  private

  def member_from_jwt
    return nil if cookies.signed[:authentication_id].nil?
    payload = decode_jwt(cookies.signed[:authentication_id])
    Member.find_by(id: payload['id'])
  end

  def member_from_cookie
    Member.find_from_request(akid: params[:akid], id: cookies.signed[:member_id])
  end
end
