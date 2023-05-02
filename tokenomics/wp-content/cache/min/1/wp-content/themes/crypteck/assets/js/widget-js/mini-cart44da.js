(function($){'use strict';function jwsTheme(){var self=this;self.$window=$(window);self.$document=$(document);self.$html=$('html');self.$body=$('body');self.$widgetPanel=$('.jws_mini_cart');self.bind();self.widgetPanelPrep()};jwsTheme.prototype={bind:function(){var self=this;if(self.$widgetPanel.length){self.widgetPanelBind()}},widgetPanelPrep:function(){var self=this;self.cartPanelAjax=null;self.quantityInputsBindButtons(self.$body);self.$body.on('blur','input.qty',function(){var $quantityInput=$(this),currentVal=parseFloat($quantityInput.val()),max=parseFloat($quantityInput.attr('max'));if(currentVal===''||currentVal==='NaN'){currentVal=0}
if(max==='NaN'){max=''}
if(currentVal>max){$quantityInput.val(max);currentVal=max};if(currentVal>0){self.widgetPanelCartUpdate($quantityInput)}});self.$document.on('jws_qty_change',function(event,quantityInput){self.widgetPanelCartUpdate($(quantityInput))})},widgetPanelBind:function(){var self=this;self.$body.on('click','.jws-cart-panel .cart_list .remove',function(e){e.preventDefault();self.widgetPanelCartRemoveProduct(this)})},shopCheckVariationDetails:function($variationDetailsWrap){var $variationDetailsChildren=$variationDetailsWrap.children(),variationDetailsEmpty=!0;if($variationDetailsChildren.length){for(var i=0;i<$variationDetailsChildren.length;i++){if($variationDetailsChildren.eq(i).children().length){variationDetailsEmpty=!1;break}}}
if(variationDetailsEmpty){$variationDetailsWrap.hide()}else{$variationDetailsWrap.show()}},widgetPanelCartRemoveProduct:function(button){var self=this,$button=$(button),$itemLi=$button.closest('li'),$itemUl=$itemLi.parent('ul'),cartItemKey=$button.data('cart-item-key');$itemLi.closest('li').addClass('loading');$itemLi.closest('li').append('<div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>');self.cartPanelAjax=$.ajax({type:'POST',url:jws_script.ajax_url,data:{action:'jws_cart_panel_remove_product',cart_item_key:cartItemKey},dataType:'json',error:function(XMLHttpRequest,textStatus,errorThrown){console.log('jws: AJAX error - widgetPanelCartRemoveProduct() - '+errorThrown);$itemLi.closest('li').removeClass('loading')},complete:function(response){self.cartPanelAjax=null;var json=response.responseJSON;if(json&&json.status==='1'){$itemLi.css({'-webkit-transition':'0.2s opacity ease',transition:'0.2s opacity ease',opacity:'0'});setTimeout(function(){$itemLi.css('display','block').slideUp(150,function(){$itemLi.remove();var $cartLis=$itemUl.children('li');if($cartLis.length==1){$('.jws-cart-panel').addClass('jws-cart-panel-empty')}
self.shopReplaceFragments(json.fragments);self.$body.trigger('added_to_cart',[json.fragments,json.cart_hash])})},160);var url=window.location.protocol+"//"+window.location.host;$.get(url,function(response){var $result_html=$(response).find('.free_ship_nhe').html();$('.free_ship_nhe').html($result_html);$(document.body).trigger('jws_ajax_filter_request_success',[response,url])},'html')}else{console.log("jws: Couldn't remove product from cart")}}})},widgetPanelCartUpdate:function($quantityInput){var self=this;if(self.cartPanelAjax){self.cartPanelAjax.abort()}
$quantityInput.closest('li').addClass('loading');var data={action:'jws_cart_panel_update'};data[$quantityInput.attr('name')]=$quantityInput.val();self.cartPanelAjax=$.ajax({type:'POST',url:jws_script.ajax_url,data:data,cache:!1,dataType:'json',complete:function(response){var json=response.responseJSON;if(json&&json.status==='1'){self.shopReplaceFragments(json.fragments)}
$('.jws-cart-panel .cart_list').children('.loading').removeClass('loading')}})},shopReplaceFragments:function(fragments){var $fragment;$.each(fragments,function(selector,fragment){$fragment=$(fragment);if($fragment.length){$(selector).replaceWith($fragment)}})},quantityInputsBindButtons:function($container){var self=this;$container.off('click.jwsQty').on('click.jwsQty','.jws-qty-plus, .jws-qty-minus',function(e){e.preventDefault();var $this=$(this),$qty=$this.closest('.quantity').find('.qty'),currentVal=parseFloat($qty.val()),max=parseFloat($qty.attr('max')),min=parseFloat($qty.attr('min')),step=$qty.attr('step');if(!currentVal||currentVal===''||currentVal==='NaN')currentVal=0;if(max===''||max==='NaN')max='';if(min===''||min==='NaN')min=0;if(step==='any'||step===''||step===undefined||parseFloat(step)==='NaN')step=1;if($this.hasClass('jws-qty-plus')){if(max&&(max==currentVal||currentVal>max)){$qty.val(max)}else{$qty.val(currentVal+parseFloat(step));self.quantityInputsTriggerEvents($qty)}}else{if(min&&(min==currentVal||currentVal<min)){$qty.val(min)}else if(currentVal>0){$qty.val(currentVal-parseFloat(step));self.quantityInputsTriggerEvents($qty)}}});if($('body').hasClass('woocommerce-cart')){jQuery(document.body).on('updated_cart_totals',function(){var $qty=$('.quantity .qty');self.$document.trigger('jws_qty_change',$qty)})}},quantityInputsTriggerEvents:function($qty){var self=this;$qty.trigger('change');if(!$('body').hasClass('woocommerce-cart')){self.$document.trigger('jws_qty_change',$qty)}},};$.jwsTheme=jwsTheme.prototype;var mini_cart=function($scope,$){$scope.find('.jws_mini_cart').eq(0).each(function(){var seft=$(this),widget=seft.find('.jws-cart-nav'),body=seft.closest('body'),cartWidgetSide=seft,id=$(this).closest('.elementor-element').data('id'),popup_id=$('.jws-mini-cart-wrapper'),cartWidgetContent=seft.find('.jws_cart_content');$('.cart-close').on('click',function(e){popup_id.removeClass('active')});widget.on('click',function(e){if(!isCart()&&!isCheckout())e.preventDefault();if(isOpened(popup_id)){closeWidget(id)}else{setTimeout(function(){openWidget()},10)}});body.on("click touchstart",".jws-cart-overlay , .cart-close",function(){if(isOpened()){closeWidget()}});$(document).keyup(function(e){if(e.keyCode===27&&isOpened())closeWidget()});var closeWidget=function(){popup_id.removeClass('active');$('body').css({position:'','margin-left':'','margin-right':'',});setTimeout(function(){$('body').removeClass('jws-cart-animating').css({width:'',})},300)};var openWidget=function(){if(isCart()||isCheckout())return!1;var wrap_width=cartWidgetContent.width()+'px';$('body').addClass('jws-cart-animating').css({position:'absolute',width:'100%','margin-left':'-'+wrap_width,'margin-right':'auto'});popup_id.addClass('active');$('.jws-offcanvas-show').removeClass('jws-offcanvas-show')};var isOpened=function(){return popup_id.hasClass('active')};var isCart=function(){return $('body').hasClass('woocommerce-cart')};var isCheckout=function(){return $('body').hasClass('woocommerce-checkout')};$('body').on('added_to_cart',function(){popup_id.addClass('active')})})}
$(window).on('elementor/frontend/init',function(){elementorFrontend.hooks.addAction('frontend/element_ready/jws_mini_cart.default',mini_cart)});$(document).ready(function(){new jwsTheme()})})(jQuery)