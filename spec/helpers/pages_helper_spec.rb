# frozen_string_literal: true

require 'rails_helper'

describe PagesHelper do
  let(:page) { build :page, id: 77 }

  describe '#page_nav_item' do
    it 'returns li element with link' do
      actual = helper.page_nav_item('foo', '/bar')
      expect(actual).to eq('<li><a href="/bar">foo</a></li>')
    end
  end

  describe '#toggle_switch' do
    it 'returns link when active' do
      actual = helper.toggle_switch(true, true, 'foo')
      expect(actual).to eq(
        '<a class="btn-primary btn toggle-button btn-default" data-state="true">foo</a>'
      )
    end

    it 'returns link when inactive' do
      actual = helper.toggle_switch(true, false, 'foo')
      expect(actual).to eq(
        '<a class=" btn toggle-button btn-default" data-state="true">foo</a>'
      )
    end
  end

  describe 'format_ak_ui_url' do
    it 'returns the passed value if no Settings.ak_ui_url' do
      url = 'https://act.sumofus.org/rest/v1/petition/1234'
      expect(helper.format_ak_ui_url(url, nil)).to eq url
    end

    it "returns the passed value if it doesn't contain 'rest/v1'" do
      url = 'https://act.sumofus.org/petition/1234'
      expect(helper.format_ak_ui_url(url, 'https://google.com')).to eq url
    end

    it "replaces everything leading up to 'rest/v1' with Settings.ak_ui_url" do
      ak_ui_url = 'https://act.sumofus.org/admin/core'
      initial = 'https://act.sumofus.org/rest/v1/petition/1234'
      expected = 'https://act.sumofus.org/admin/core/petition/1234'
      expect(helper.format_ak_ui_url(initial, ak_ui_url)).to eq expected
    end
  end

  describe 'ak_resource_id' do
    it 'parses an ak petition resource uri to an ID' do
      ak_resource_url = 'https://act.sumofus.org/rest/v1/petitionpage/11207/'
      expect(helper.ak_resource_id(ak_resource_url)).to eq '11207'
    end

    it 'parses an ak donation resource uri to an ID' do
      ak_resource_url = 'https://act.sumofus.org/rest/v1/donationpage/12345/'
      expect(helper.ak_resource_id(ak_resource_url)).to eq '12345'
    end

    it 'works without a trailing slash' do
      ak_resource_url = 'https://act.sumofus.org/rest/v1/donationpage/12345'
      expect(helper.ak_resource_id(ak_resource_url)).to eq '12345'
    end
  end

  describe '#prefill_link' do
    it 'prefills link for twitter' do
      variant = Share::Twitter.new
      expect(variant.description).to eq nil
      expect(prefill_link(variant).description).to eq '{LINK}'
    end

    it 'prefills link for twitter' do
      variant = Share::Email.new
      expect(variant.body).to eq nil
      expect(prefill_link(variant).body).to eq '{LINK}'
    end

    it 'prefills nothing for facebook' do
      variant = Share::Facebook.new
      expect(prefill_link(variant).attributes).to eq Share::Facebook.new.attributes
    end
  end

  describe 'serialize' do
    it 'can serialize with a symbol keys and symbol query' do
      expect(serialize({ foo: 'bar' }, :foo)).to eq '"bar"'
    end

    it 'can serialize with a symbol keys and string query' do
      expect(serialize({ foo: 'bar' }, 'foo')).to eq '"bar"'
    end

    it 'can serialize with a string keys and symbol query' do
      expect(serialize({ 'foo' => 'bar' }, :foo)).to eq '"bar"'
    end

    it 'can serialize with a string keys and string query' do
      expect(serialize({ 'foo' => 'bar' }, 'foo')).to eq '"bar"'
    end

    it 'renders empty object if key is missing' do
      expect(serialize({ foo: 'bar' }, :baz)).to eq '{}'
    end

    it 'renders empty object if value is nil' do
      expect(serialize({ foo: nil }, :foo)).to eq '{}'
    end

    it 'renders empty string if value is blank' do
      expect(serialize({ foo: ' ' }, :foo)).to eq '" "'
    end

    it 'renders empty array if value is empty array' do
      expect(serialize({ foo: [] }, :foo)).to eq '[]'
    end

    it 'serializes a subhash into appropriate json' do
      expect(serialize({ foo: { bar: 'baz', quu: 'ray' } }, :foo)).to eq '{"bar":"baz","quu":"ray"}'
    end
  end

  describe 'share_card' do
    it 'returns {} if no associated share' do
      expect(share_card(page)).to eq({})
    end

    it 'returns content of the only share if just one' do
      share = create :share_facebook, page_id: page.id, title: 'the title', description: 'scripting'
      expect(share_card(page)).to eq(title: 'the title',
                                     description: 'scripting',
                                     image: nil)
    end

    it 'returns content of last share if multiple' do
      share = create :share_facebook, page_id: page.id, title: 'richard', description: 'garfield'
      share = create :share_facebook, page_id: page.id, title: 'the title', description: 'scripting'
      expect(share_card(page)).to eq(title: 'the title',
                                     description: 'scripting',
                                     image: nil)
    end

    it 'returns the url of the image if one exists' do
      allow(Image).to receive(:find_by).and_return(instance_double(Image, content: double(url: 'this/is/a/url')))
      share = create :share_facebook, page_id: page.id, title: 'the title', description: 'scripting'
      expect(share_card(page)).to eq(title: 'the title',
                                     description: 'scripting',
                                     image: 'this/is/a/url')
    end
  end

  describe 'twitter_meta' do
    it 'has all expected keys' do
      expect(twitter_meta(page).keys).to match_array(%w[
        card domain site creator title description image
      ].map(&:to_sym))
    end

    it 'uses title, description, and image from share_card if present' do
      share_data = {
        title: 'the title',
        description: 'scripting',
        image: 'this/is/a/url'
      }
      expect(twitter_meta(page, share_data)).to include(share_data)
    end

    it 'ignores share_card if empty' do
      expect(twitter_meta(page, {})).to include(title: page.title)
    end

    it 'uses only non-blank elements in share_card' do
      share_card = {
        title: '',
        description: 'scripting',
        image: nil
      }
      allow(page).to receive(:primary_image).and_return(instance_double(Image, content: double(url: 'this/is/a/url')))
      expect(twitter_meta(page, share_card)).to include(
        title: page.title,
        description: 'scripting',
        image: 'this/is/a/url'
      )
    end
  end

  describe 'facebook_meta' do
    it 'has all expected keys' do
      expect(facebook_meta(page).keys).to match_array(%w[
        site_name title description url type article image
      ].map(&:to_sym))
    end

    it 'uses title, description, and image from share_card if present' do
      share_data = {
        title: 'the title',
        description: 'scripting',
        image: 'this/is/a/url'
      }
      expect(facebook_meta(page, share_data)).to include(share_data.merge(image: 'this/is/a/url'))
    end

    it 'ignores share_card if empty' do
      expect(facebook_meta(page, {})).to include(title: page.title)
    end

    it 'uses only non-blank elements in share_card' do
      share_card = {
        title: '',
        description: 'scripting',
        image: nil
      }
      allow(page).to receive(:primary_image).and_return(instance_double(Image, content: double(url: 'this/is/a/url')))
      expect(facebook_meta(page, share_card)).to include(
        title: page.title,
        description: 'scripting',
        image: 'this/is/a/url'
      )
    end
  end

  describe 'toggle_featured_link' do
    subject { helper.toggle_featured_link(page) }

    context 'when page is featured' do
      let(:page) { double(featured?: true, to_param: '1', id: '1') }

      describe 'rendering' do
        it 'with correct data-method' do
          expect(subject).to match(/data-method="delete"/)
        end

        it 'with correct path' do
          expect(subject).to match(%r{featured_pages\/1})
        end
      end
    end

    context 'when page is not featured' do
      let(:page) { double(featured?: false, to_param: '1', id: '1') }

      describe 'rendering' do
        it 'with correct data-method' do
          expect(subject).to match(/data-method="post"/)
        end

        it 'with correct path' do
          expect(subject).to match(/featured_pages\?id=1/)
        end
      end
    end
  end

  describe '#share_url' do
    let(:button) { double(sp_id: '2', sp_type: 'facebook') }

    it 'returns share url' do
      expect(helper.share_url(button)).to eq('http://sumof.us/99/2/facebook')
    end
  end

  describe '#javascript_pack_tag_for_plugin' do
    let(:call_tool) { create(:call_tool) }
    let(:thermometer) { create(:plugins_thermometer) }

    it 'includes a script tag for (webpacker) plugins that exist' do
      expect(helper.javascript_pack_tag_for_plugin(call_tool)).to eq('<script src="/packs-test/call_tool.js"></script>')
    end

    it 'does not include script tag for (webpacker) plugins that exist' do
      # Until these are moved to their separate plugins, if ever...
      expect(helper.javascript_pack_tag_for_plugin(thermometer)).to be_nil
    end
  end

  describe '#stylesheet_pack_tag_for_plugin' do
    let(:call_tool) { create(:call_tool) }
    let(:thermometer) { create(:plugins_thermometer) }

    it 'does not include stylesheet if we are not in production' do
      expect(helper.stylesheet_pack_tag_for_plugin(call_tool)).to eq(nil)
    end

    it 'includes stylesheet if we are in production and plugin exists' do
      allow(Rails).to receive(:env).and_return 'production'.inquiry
      expect(helper.stylesheet_pack_tag_for_plugin(call_tool))
        .to eq('<link rel="stylesheet" media="screen" href="/packs-test/call_tool.css" />')
    end
  end
end
