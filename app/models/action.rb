# frozen_string_literal: true

# == Schema Information
#
# Table name: actions
#
#  id                :integer          not null, primary key
#  page_id           :integer
#  member_id         :integer
#  link              :string
#  created_user      :boolean
#  subscribed_user   :boolean
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  form_data         :jsonb
#  subscribed_member :boolean          default(TRUE)
#  donation          :boolean          default(FALSE)
#  publish_status    :integer          default(0), not null
#

class Action < ApplicationRecord
  STREAM = Aws::DynamoDB::Client.new(
    region: Settings.aws_region
  )

  belongs_to :page, counter_cache: :action_count
  belongs_to :member
  after_create :push_to_stream

  enum publish_status: %i[default published hidden]

  has_paper_trail on: %i[update destroy]
  scope :donation, -> { where(donation: true) }
  scope :not_donation, -> { where.not(donation: true) }

  private

  def clean_empty_strings(item)
    enforce_types = {
      datetime: :to_s,
      integer: :to_s
    }

    item = item.each do |k, v|
      type = Action.columns_hash[k]&.type
      enforcer = enforce_types[type]

      item[k] = v.send(enforcer) if enforcer
      item[k] = false if type == :boolean && !item[k]
      item[k] = nil if v.blank?
      item[k] = clean_empty_strings(item[k]) if item[k].is_a? Hash
    end

    item
  end

  def push_to_stream
    return unless Settings.stream_name
    item = clean_empty_strings(item)

    STREAM.put_item(item: item,
                    table_name: Settings.action_stream_name)
  end
end
