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
    
    function FreezePanel(elmt, opts){
        this.defaults = {
            row: 0,
            col: 1,
            autohide: true
        };
        this.$elmt = $(elmt);
        this.$cell;
        this.$container;
        this.$topLeft;
        this.$topRight;
        this.$bottomLeft;
        this.$bottomRight;
        this.$tl;
        this.$tr;
        this.$bl;
        this.$br;
        this.options;
        this.regions = {
            "tl": null,
            "tr": null,
            "bl": null,
            "br": null
        };
        this.init(opts);
        this.redraw = false;
    }
    
    FreezePanel.prototype.constructor = function() {
    };
    
    FreezePanel.prototype.init = function(opts) {
        var inst = this;
        inst.options = $.extend({}, inst.defaults, opts);
        inst.$container = $('<div class="freeze-container"/>');
        inst.$topLeft = $('<div class="freeze-left freeze-top freeze-top-left"><div class="freeze-panel"/></div>');
        inst.$topRight = $('<div class="freeze-top freeze-top-right"><div class="freeze-panel"/></div>');
        inst.$bottomLeft = $('<div class="freeze-left freeze-bottom-left"><div class="freeze-panel"/></div>');
        inst.$bottomRight = $('<div class="freeze-bottom-right"><div class="freeze-panel"/></div>');
        inst.$elmt.data('freezePane', inst);
        inst.$elmt.trigger('fp.init');
    };
    
    FreezePanel.prototype.draw = function() {
        var inst = this; // alias
        inst.$elmt.before(inst.$container);
        inst.regions.tl = inst.$tl = inst.$elmt.clone(true).attr('id', null).data('freezePane', inst);
        inst.regions.tr = inst.$tr = inst.$elmt.clone(true).attr('id', null).data('freezePane', inst);
        inst.regions.bl = inst.$bl = inst.$elmt.clone(true).attr('id', null).data('freezePane', inst);
        inst.regions.br = inst.$br = inst.$elmt.clone(true).attr('id', null).data('freezePane', inst);
        var $topLeftPanel = inst.$topLeft.find('.freeze-panel');
        var $topRightPanel = inst.$topRight.find('.freeze-panel');
        var $bottomLeftPanel = inst.$bottomLeft.find('.freeze-panel');
        var $bottomRightPanel = inst.$bottomRight.find('.freeze-panel');
        $topLeftPanel.find('table').remove();
        $topLeftPanel.append(inst.$tl);
        $topRightPanel.find('table').remove();
        $topRightPanel.append(inst.$tr);
        $bottomLeftPanel.find('table').remove();
        $bottomLeftPanel.append(inst.$bl);
        $bottomRightPanel.find('table').remove();
        $bottomRightPanel.append(inst.$br);
        inst.$container.append(inst.$topLeft);
        inst.$container.append(inst.$topRight);
        inst.$container.append(inst.$bottomLeft);
        inst.$container.append(inst.$bottomRight);
        // Handle scroll
        inst.$container.on('scroll', function(e) {
            e.preventDefault();
            var $this = $(this);
            var top = $this.scrollTop();
            var left = $this.scrollLeft();
            if(inst.options.row > -1) {
                $('.freeze-top', inst.$container).css({"top": top});
            }
            if(inst.options.col > -1) {
                $('.freeze-left', inst.$container).css({"left": left});
            }
        });
        // Handle click
        inst.$container.on('click', function(e) {
            var $target = $(e.target);
            var srcNode = $target.prop('nodeName');
            if(srcNode === 'TD' || srcNode === 'TH') {
                var row = $target.parent();
                var table = row.parents('table');
                var colIdx = row.children().index($target);
                var rowIdx = table.find('tr').index(row);
                var evtData = {row: rowIdx, col: colIdx, src: e.target};
                var evt = jQuery.Event('fp.click');
                for(var prop in inst.regions) {
                    inst.regions[prop].
                        find('tr').eq(rowIdx).
                        find(srcNode).eq(colIdx).
                        trigger(evt, evtData);
                }
                // Send event to actual table
                inst.$elmt.
                    find('tr').eq(rowIdx).
                    find(srcNode).eq(colIdx).
                    trigger('fp.click', evtData);
            }
        });
        // Setup regions dimension
        var nodeName = $('tr', inst.$elmt).eq(inst.options.row).children().eq(inst.options.col).prop('nodeName');
        inst.$cell = $('tr', inst.$topLeft).eq(inst.options.row).find(nodeName).eq(inst.options.col||0);
        var height = inst.$cell.offset().top + inst.$cell.outerHeight(true) - inst.$container.offset().top;
        var width  = inst.$cell.offset().left + inst.$cell.outerWidth(true) - inst.$container.offset().left;
        if(inst.redraw === false) {
            inst.options.row === false
                ? $('.freeze-top').hide()
                : $('.freeze-top').css({minHeight: height, height: height});
            inst.options.col === false
                ? $('.freeze-left').hide()
                : $('.freeze-left').css({width: width});
        } else {
            $('.freeze-top', inst.$container).css("top", '');
            $('.freeze-left', inst.$container).css("left", '');
        }
        
        if(true === inst.options.autohide) {
            inst.$elmt.hide();
        }
        
        inst.$elmt.trigger('fp.draw');
        inst.redraw = true;
    };

    FreezePanel.prototype.destroy = function() {
        
    };
    
    function FreezeFactory( elmt, opts )
    {
        if(elmt.prop('nodeName') !== 'TABLE') return;
        var inst = new FreezePanel(elmt, opts);
        
        return inst;
    }
  
    var methods = {
        getInstance: function() {
            return $(this).data('freezePane');
        },
        row : function( val ) {
            var $this = $(this);
            var inst  = $this.data('freezePane');
            if ( typeof val === 'undefined' ) {
                return inst.options.row;
            } else {
                inst.options.row = val;
                inst.draw();
                
                return inst;
            }
        },
        col : function( val ) {
            var $this = $(this);
            var data  = $this.data('freezePane');
            if ( typeof val !== 'undefined' ) 
                data.col = val; 
            else 
                return data.col;
        },
        freeze : function(opts) {
            var $this = $(this);
            var inst = $this.freezePane('getInstance');
            if(inst) {
                inst.draw();
                return inst;
            }
            inst = new FreezeFactory($this, opts);
            inst.draw();
            
            return this;
        },
        unfreeze : function() {
            var $this = $(this);
            var inst = $this.freezePane('getInstance');
            if(!inst) return;
            inst.$container.remove();
            inst.$elmt.show();
            $this.data('freezePane', undefined);
            
            return this;
        }
    };
    /**
     * jQuery plugin
     * s
     * @param {string|Object} method Method name or options object
     */
    $.fn.freezePane = function( method ) {
        var rtn;
        if ( typeof method === 'object' ) {
            rtn = methods.freeze.apply( this, arguments );
        } else if( typeof method === 'string' && methods[method] ) {
            rtn = methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else {
            rtn = methods.getInstance.apply(this);
        }
        
        return rtn;
    };
    /**
     * DataTables integration
     */
    if(typeof jQuery.fn.dataTable === 'function' || typeof jQuery.fn.DataTable === 'function') {
        jQuery.fn.DataTable.FreezePane = jQuery.fn.dataTable.FreezePane = $.fn.freezePane;
        var resetDataTable = function(e, settings) {
            var table = jQuery(settings.nTable);
            var opts = jQuery.extend({}, settings.oInit.freezePane);
            if(table.freezePane('getInstance') instanceof FreezePanel) {
                table.freezePane('unfreeze');
            }
            table.freezePane(settings.oInit.freezePane);
        };
        jQuery(document)
            .on('page.dt', resetDataTable)
            .on('length.dt', resetDataTable)
            .on('page.dt', resetDataTable)
            .on('order.dt', resetDataTable)
            .on('search.dt', resetDataTable)
            .on('draw.dt', resetDataTable);
    }
})( jQuery );