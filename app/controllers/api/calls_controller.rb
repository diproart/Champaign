# frozen_string_literal: true
class Api::CallsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    service = CallCreator.new(call_params)

    if service.run
      @call = service.call
      render :show
    else
      render json: { errors: service.errors, name: 'call' }, status: :unprocessable_entity
    end
  end

  def show
    @call = Call.find(params[:id])
  end

  private

  def call_params
    params.require(:call)
      .permit(:member_phone_number, :target_index)
      .merge(page_id: params[:page_id],
             member_id: recognized_member&.id)
  end
end
