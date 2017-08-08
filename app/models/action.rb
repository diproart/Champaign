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
#  form_data         :jsonb            default("{}")
#  subscribed_member :boolean          default("true")
#  donation          :boolean          default("false")
#  publish_status    :integer          default("0"), not null
#

class Action < ApplicationRecord
  belongs_to :page, counter_cache: :action_count
  belongs_to :member

  enum publish_status: %i[default published hidden]

  has_paper_trail on: %i[update destroy]
  scope :donation, -> { where(donation: true) }
  scope :not_donation, -> { where.not(donation: true) }
end
