(function(jQuery){
	
	jQuery.fn.previewForm = function(options){
		var form_settings = jQuery.extend({
			identifier         : 'label',
			show_password        : true,
			extratext    : 'Do You Want To submit',
			yes	 : 'yes',
			no	 : 'no',
			title	 : 'Please preview'			
		}, options);
				
			var dia_log;	
			var renderBUTTON;
			var this_frm;
			this_frm = jQuery(this);
		
	jQuery(this).submit(function (){

	if(jQuery('#pfomdata').length){
						return true;
					}
		
		
		dia_log="";
		var needle_cnfrm;
	
		if(this.id.length > 0){ needle_cnfrm = '#'+this.id+' label'; }
		else  { needle_cnfrm = '.'+jQuery(this).attr('class')+' label'; }
		
	jQuery(needle_cnfrm).each(function(i,val) {
		if(jQuery(this).text().length >2){
			
	what_t= jQuery('#'+jQuery(this).attr('for')) ;
	
	switch(what_t.prop('type')){
	case 'password':
	if(!form_settings.show_password)
		dia_log +=jQuery(this).text() + " your selected password<br/>";
	else
		dia_log +=jQuery(this).text() +what_t.val()+"<br/>";
		break;
	case 'select-one':
	dia_log +=jQuery(this).text()  +jQuery('#'+jQuery(this).attr('for')+' option:selected').text()+"<br/>";
		break;
	case 'radio':
	if( what_t.is(':checked'))
	dia_log +=jQuery(this).text() +' '+what_t.val()+"<br/>";
		break;
	case 'checkbox':
	if( what_t.is(':checked'))
	dia_log +=jQuery(this).text() +' '+what_t.val()+"<br/>";
		break;
	case 'undefined':
		break;
	default:
	dia_log +=jQuery(this).text() +what_t.val()+"<br/>";
	break;
	
	}
	}
		});
		dia_log = dia_log.replace('undefined', '');
		
		
		renderBUTTON="";
		renderBUTTON += '<a href="javascript:void(0);" class="button form_yes">'+form_settings.yes+'<span></span></a>';
		renderBUTTON += '<a href="javascript:void(0);" class="button form_no">'+form_settings.no+'<span></span></a>';
		
		var renderTemplate = [
			'<div id="previewOverlay">',
			'<div id="previewBox">',
			'<h1>',form_settings.title,'</h1>',
			'<p>',dia_log,'</p>',
			'<p>',form_settings.extratext,'</p>',
			'<div id="previewButtons">',
			renderBUTTON,
			'</div></div></div>'
		].join('');
		
		jQuery(renderTemplate).hide().appendTo('body').fadeIn();
		
	jQuery(".form_yes") .click(function(){
			var input = jQuery("<input>").attr("type", "hidden").attr("id", "pfomdata").val("true");
				this_frm.append(jQuery(input));
				this_frm.submit();
			});
			
	jQuery(".form_no") .click(function(){
				jQuery('#previewOverlay').fadeOut(function(){
				jQuery(this).remove();
					});
			});
					
	return false;
			
		});
	}
	
})(jQuery);