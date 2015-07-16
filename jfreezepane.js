/**
 * jFreezePane 
 * 
 * jQuery plugin to create freeze column and header view of
 * html table element.
 * 
 * Copyright (C) 2012 - Lim Afriyadi
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 * 
 * @author <a href="http://afriyadilim.blogspot.com">Lim Afriyadi</a>
 */ 
(function($){
    /**
     * Freeze function
     * @function
     */
    var dfltOpts = {
        row: 0,
        col: 1,
        autohide: true
    };
    
    function fnFreeze( elmt, opts )
    {
        if(elmt.prop('nodeName') !== 'TABLE') return;
        opts = $.extend(dfltOpts, opts);
        var container = $('<div class="freeze-container"/>');
        elmt.before(container);
        var $topLeft = $('<div class="freeze-left freeze-top freeze-top-left"><div class="freeze-panel"/></div>');
        var $topRight = $('<div class="freeze-top freeze-top-right"><div class="freeze-panel"/></div>');
        var $bottomLeft = $('<div class="freeze-left freeze-bottom-left"><div class="freeze-panel"/></div>');
        var $bottomRight = $('<div class="freeze-bottom-right"><div class="freeze-panel"/></div>');
        var tables = {
            tl: elmt.clone(true).attr('id', null),
            tr: elmt.clone(true).attr('id', null),
            bl: elmt.clone(true).attr('id', null),
            br: elmt.clone(true).attr('id', null)
        };
        $topLeft.find('.freeze-panel').append(tables.tl);
        $topRight.find('.freeze-panel').append(tables.tr);
        $bottomLeft.find('.freeze-panel').append(tables.bl);
        $bottomRight.find('.freeze-panel').append(tables.br);
        container.append($topLeft);
        container.append($topRight);
        container.append($bottomLeft);
        container.append($bottomRight);
        container.on('scroll', function(e) {
            e.preventDefault();
            var top = $(this).scrollTop();
            var left = $(this).scrollLeft();
            $('.freeze-top', container).css({top: top});
            $('.freeze-left', container).css({left: left});
        });
        container.on('click', function(e) {
            var $target = $(e.target);
            var srcNode = $target.prop('nodeName');
            if(srcNode === 'TD' || srcNode === 'TH') {
                var row = $target.parent();
                var table = row.parents('table');
                var colIdx = row.children().index($target);
                var rowIdx = table.find('tr').index(row);
                for(var prop in tables) {
                    tables[prop].find('tr').eq(rowIdx).find(srcNode).eq(colIdx).trigger($.Event("fp.click", {row: rowIdx, col: colIdx}));
                }
                // Send event to actual table
                elmt.find('tr').eq(rowIdx).find(srcNode).eq(colIdx).trigger(
                    $.Event("fp.click", {row: rowIdx, col: colIdx})
                );
            }
        });
        var nodeName = $('tr', elmt).eq(opts.row).children().eq(opts.col).prop('nodeName');
        var cell = $('.freeze-panel table tr:eq('+opts.row+') > '+nodeName+':eq('+opts.col+')', $topLeft);
        var height = cell.offset().top + cell.outerHeight(true) - container.offset().top;
        var width  = cell.offset().left + cell.outerWidth(true) - container.offset().left - 2;
        $('.freeze-top').css({minHeight: height, height: height});
        $('.freeze-left').css({width: width});
        elmt.data('freezePane', container);
        if(opts.autohide) {
            elmt.hide();
        }
        
        return container;
    }
  
    var methods = {
        getContainer: function(elmt) {
            return $(elmt).data('freezePane');
        },
        init : function(opts) {
            var $this = $(this);
            return $this.data('freezePane') 
                ? $this.data('freezePane')
                : $this.data('freezePane', fnFreeze($this, opts));
        },
        row : function( val ) {
            var $this = $(this);
            var data  = $this.data('freezePane');
            if ( typeof val !== 'undefined' ) 
                data.row = val;
            else 
                return data.row;
        },
        col : function( val ) {
            var $this = $(this);
            var data  = $this.data('freezePane');
            if ( typeof val !== 'undefined' ) 
                data.col = val; 
            else 
                return data.col;
        },
        freeze : function() {
            var $this = $(this);
            var data  = $this.data('freezePane');
            fnFreeze($this, data.row, data.col);
        },
        unfreeze : function() {
            var $this = $(this);
            if($this.data('freezePane')){ 
                $this.data('freezePane').remove();
                $this.show();
            }
        }
    };
  
    $.fn.freezePane = function( method ) {
        if( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' ) {
            return methods.init.apply( this, arguments );
        } else {
            return $.error( 'Method ' +  method + ' does not exist on jQuery.freezePane' );
        }
    };
    
    if(typeof jQuery.fn.dataTable === 'function') {
        jQuery.fn.DataTable.FreezePane = jQuery.fn.dataTable.FreezePane = $.fn.freezePane;
        var resetDataTable = function(e, settings) {
            var elmt = jQuery(settings.nTable);
            if(elmt.data('freezePane')) {
                elmt.freezePane('unfreeze');
            }
        };
        jQuery(document)
            .on('page.dt', resetDataTable)
            .on('length.dt', resetDataTable)
            .on('page.dt', resetDataTable)
            .on('order.dt', resetDataTable);
    }
    
    jQuery(document).on( 'draw.dt', function(e, settings) {
        fnFreeze(jQuery(settings.nTable), settings.oInit.freezePane);
    });
})( jQuery );