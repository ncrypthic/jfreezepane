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
    function fnFreeze(elmt, col)
    {
        var cols,rows,tempTbl1,tempTbl2,tempTbl3,tempTbl4;
        // Create a container for our plugin.
        elmt.before($('<div id="freezeContainer"></div>'));
        // Create left and right column.
        $('#freezeContainer').append($('<div id="leftCol"></div>'));
        $('#freezeContainer').append($('<div id="rightCol"></div>'));
        if(col > 0)
        {
            var newRow,headers;
            tempTbl1 = $('<table id="freezeCol"><thead></thead><tfoot></tfoot><tbody></tbody></table>');
            tempTbl2 = $('<table id="freezeHeader"><thead></thead><tfoot></tfoot><tbody></tbody></table>');
            tempTbl3 = $('<table id="freezeContent"><thead></thead><tfoot></tfoot><tbody></tbody></table>');
            tempTbl4 = $('<table id="freezeColHeader"><thead></thead><tfoot></tfoot><tbody></tbody></table>');
            rows = $('tr',elmt);
            // For every table row in the element
            rows.each(function()
            {
                // Find table headers element.
                if($(this).find('th').length > 0)
                {
                    headers = $('th',this);
                    newRow=$('<tr></tr>');
                    // Table header in frozen columns.
                    for(i = 0; i < col; i++)
                    {
                        // Add the header element into temporary new row
                        newRow.append(headers[i]);
                    }
                    // Add table header into freezeColHeader
                    $('thead',tempTbl4).append(newRow);
                    newRow=$('<tr></tr>');
                    // Table header in data columns.
                    for(i = col; i < headers.length; i++)
                    {
                        newRow.append(headers[i]);
                    }
                    // Add table header into freezeHeader
                    $('thead',tempTbl2).append(newRow);
                }
                else
                {
                    cols=$('td',this);
                    newRow=$('<tr></tr>');
                    // Table data element in frozen columns
                    for(i = 0; i < col; i++)
                    {
                        // Add the data element into temporary new row
                        newRow.append(cols[i]);
                    }
                    // Add the new temporary row into #freezeCol table
                    $('tbody',tempTbl1).append(newRow);
                    newRow=$('<tr></tr>');
                    for(i = col; i < cols.length; i++)
                    {
                        newRow.append(cols[i]);
                    }
                    // Add the new temporary row into #freezeContent table
                    $('tbody',tempTbl3).append(newRow);
                }
            })
        }
        // Remove the original element
        elmt.remove();
        jQuery('#leftCol').prepend(tempTbl1);
        jQuery('#leftCol').prepend(tempTbl4);
        jQuery('#rightCol').append(tempTbl2);
        jQuery('#rightCol').append(tempTbl3);
        $('#rightCol').css('width',jQuery('#freezeContainer').width() - jQuery('#freezeCol').width());
        jQuery(window).scroll(function(){ 
            if(document.body.scrollLeft > 0)
            {
                jQuery('#leftCol').css({
                    'position':'relative',
                    'left':document.body.scrollLeft
                });
            }
            else
            {
                jQuery('#leftCol').css({
                    'position':'relative',
                    'left':document.body.scrollLeft
                });
            }
            if(document.body.scrollTop > 0)
            {
                jQuery('#freezeColHeader').css({
                    'position':'relative',
                    'top':document.body.scrollTop
                });
                jQuery('#freezeHeader').css({
                    'position':'relative',
                    'top':document.body.scrollTop
                });
            }
            else
            {
                jQuery('#freezeColHeader').css({
                    'position':'',
                    'top':''
                });
                jQuery('#freezeHeader').css({
                    'position':'relative',
                    'top':document.body.scrollTop
                });
            }
        });
    }
  
    var methods = {
        init : function(opts) {
            return this.each(
                function()
                {
                    var $this = $(this);
                    var data = $this.data('freezePane');
                    if (!data) {
                        $this.data('freezePane', {
                            row : (typeof opts.row != 'undefined') ? opts.row : 1,
                            col : (typeof opts.col != 'undefined') ? opts.col : 1
                        });
                        data = $this.data('freezePane');
                    }
                    else
                    {
                        if(typeof opts.row != 'undefined') data.row = opts.row;
                        if(typeof opts.col != 'undefined') data.col = opts.col;
                    }
                    fnFreeze($this, data.col);
                }
            );
        },
        row : function( val ) {
            var $this = $(this);
            var data = $this.data('freezePane');
            if ( typeof val !== 'undefined' ) 
                data.row = val;
            else 
                return data.row;
        },
        col : function( val ) {
            var $this = $(this);
            var data = $this.data('freezePane');
            if ( typeof val !== 'undefined' ) 
                data.col = val; 
            else 
                return data.col;
        },
        freeze : function() {
            var $this = $(this);
            var data = $this.data('freezePane');
            fnFreeze($this, data.row, data.col);
        },
        unfreeze : function() {
      
        }
    }
  
    $.fn.freezePane = function( method ) {
    
        if( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            return $.error( 'Method ' +  method + ' does not exist on jQuery.freezePane' );
        }
    };
})( jQuery );