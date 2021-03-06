$axure.internal(function($ax) {
    var document = window.document;
    var _visibility = {};
    $ax.visibility = _visibility;

    var _defaultHidden = {};
    var _defaultLimbo = {};

    // ******************  Visibility and State Functions ****************** //

    var _isIdVisible = $ax.visibility.IsIdVisible = function(id) {
        return $ax.visibility.IsVisible(window.document.getElementById(id));
    };

    $ax.visibility.IsVisible = function(element) {
        //cannot use css('visibility') because that gets the effective visiblity
        //e.g. won't be able to set visibility on panels inside hidden panels
        return element.style.visibility != 'hidden';
    };

    $ax.visibility.SetIdVisible = function(id, visible) {
        $ax.visibility.SetVisible(window.document.getElementById(id), visible);
        // Hide lightbox if necessary
        if(!visible) {
            $jobj($ax.repeater.applySuffixToElementId(id, '_lightbox')).remove();
            $ax.flyoutManager.unregisterPanel(id, true);
        }
    };

    var _setAllVisible = function(query, visible) {
        for(var i = 0; i < query.length; i++) {
            _visibility.SetVisible(query[i], visible);
        }
    }

    $ax.visibility.SetVisible = function (element, visible) {
        //not setting display to none to optimize measuring
        if(visible) {
            if($(element).hasClass(HIDDEN_CLASS)) $(element).removeClass(HIDDEN_CLASS);
            if($(element).hasClass(UNPLACED_CLASS)) $(element).removeClass(UNPLACED_CLASS);
            element.style.display = '';
            element.style.visibility = 'inherit';
        } else {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
        }
    };

    var _setWidgetVisibility = $ax.visibility.SetWidgetVisibility = function (elementId, options) {
        var visible = $ax.visibility.IsIdVisible(elementId);
        // If limboed, just fire the next action then leave.
        if(visible == options.value || _limboIds[elementId]) {
            if(!_limboIds[elementId]) options.onComplete && options.onComplete();
            $ax.action.fireAnimationFromQueue(elementId, $ax.action.queueTypes.fade);
            return;
        }

        options.containInner = true;
        var query = $jobj(elementId);
        var parentId = query.parent().attr('id');
        var axObj = $obj(elementId);
        var preserveScroll = false;
        var isPanel = $ax.public.fn.IsDynamicPanel(axObj.type);
        var isLayer = $ax.public.fn.IsLayer(axObj.type);
        if(!options.nocontainer px-md-5 && (isPanel || isLayer)) {
            //if dp has scrollbar, save its scroll position
            if(isPanel && axObj.scrollbars != 'none') {
                var shownState = $ax.dynamicPanelManager.getShownState(elementId);
                preserveScroll = true;
                //before hiding, try to save scroll location
                if(!options.value && shownState) {
                    DPStateAndScroll[elementId] = {
                        shownId: shownState.attr('id'),
                        left: shownState.scrollLeft(),
                        top: shownState.scrollTop()
                    }
                }
            }

            _pushcontainer px-md-5(elementId, isPanel);
            if(isPanel && !options.value) _tryResumeScrollForDP(elementId);
            var complete = options.onComplete;
            options.onComplete = function () {
                if(complete) complete();
                _popcontainer px-md-5(elementId, isPanel);
                //using container px-md-5s stops mouseleave from firing on IE/Edge and FireFox
                if(!options.value && $ax.event.mouseOverObjectId && (FIREFOX || $axure.browser.isEdge || IE)) {
                    var mouseOveredElement = $('#' + $ax.event.mouseOverObjectId);
                    if(mouseOveredElement && !mouseOveredElement.is(":visible")) {
                        var axObj = $obj($ax.event.mouseOverObjectId);

                        if(($ax.public.fn.IsDynamicPanel(axObj.type) || $ax.public.fn.IsLayer(axObj.type)) && axObj.propagate) {
                            mouseOveredElement.trigger('mouseleave');
                        } else mouseOveredElement.trigger('mouseleave.ixStyle');
                    }
                }
                //after showing dp, restore the scoll position
                if(isPanel && options.value) _tryResumeScrollForDP(elementId, true);
            }
            options.container px-md-5Exists = true;
        }
        _setVisibility(parentId, elementId, options, preserveScroll);

        //set the visibility of the annotation box as well if it exists
        var ann = document.getElementById(elementId + "_ann");
        if(ann) _visibility.SetVisible(ann, options.value);

        //set ref visibility for ref of flow shape, if that exists
        var ref = document.getElementById(elementId + '_ref');
        if(ref) _visibility.SetVisible(ref, options.value);
    };

    var _setVisibility = function(parentId, childId, options, preserveScroll) {
        var wrapped = $jobj(childId);
        var completeTotal = 1;
        var visible = $ax.visibility.IsIdVisible(childId);

        if(visible == options.value) {
            options.onComplete && options.onComplete();
            $ax.action.fireAnimationFromQueue(childId, $ax.action.queueTypes.fade);
            return;
        }

        var child = $jobj(childId);
        var size = options.size || (options.container px-md-5Exists ? $(child.children()[0]) : child);

        var isIdFitToContent = $ax.dynamicPanelManager.isIdFitToContent(parentId);
        //fade and resize won't work together when there is a container px-md-5... but we still needs the container px-md-5 for fit to content DPs
        var needcontainer px-md-5 = options.easing && options.easing != 'none' && (options.easing != 'fade' || isIdFitToContent);
        var cullPosition = options.cull ? options.cull.css('position') : '';
        var container px-md-5Exists = options.container px-md-5Exists;

        var isFullWidth = $ax.dynamicPanelManager.isPercentWidthPanel($obj(childId));

        // If fixed fit to content panel, then we must set size on it. It will be size of 0 otherwise, because container px-md-5 in it is absolute position.
        var needSetSize = false;
        var sizeObj = {};
        if(needcontainer px-md-5) {
            var sizeId = '';
            if($ax.dynamicPanelManager.isIdFitToContent(childId)) sizeId = childId;
            else {
                var panelId = $ax.repeater.removeSuffixFromElementId(childId);
                if($ax.dynamicPanelManager.isIdFitToContent(panelId)) sizeId = panelId;
            }

            if(sizeId) {
                needSetSize = true;

                sizeObj = $jobj(sizeId);
                var newSize = options.cull || sizeObj;
                var newAxSize = $ax('#' + newSize.attr('id'));
                sizeObj.width(newAxSize.width());
                sizeObj.height(newAxSize.height());
            }
        }

        var wrappedOffset = { left: 0, top: 0 };
        var visibleWrapped = wrapped;
        if(needcontainer px-md-5) {
            var childObj = $obj(childId);
            if (options.cull) {
                var axCull = $ax('#' + options.cull.attr('id'));
                var container px-md-5Width = axCull.width();
                var container px-md-5Height = axCull.height();
            } else {
                if (childObj && ($ax.public.fn.IsLayer(childObj.type))) {// || childObj.generateCompound)) {
                    var boundingRectangle = $ax('#' + childId).offsetBoundingRect();
                    //var boundingRectangle = $ax.public.fn.getWidgetBoundingRect(childId);
                    wrappedOffset.left = boundingRectangle.left;
                    wrappedOffset.top = boundingRectangle.top;
                    container px-md-5Width = boundingRectangle.width;
                    container px-md-5Height = boundingRectangle.height;
                } else if (childObj && childObj.generateCompound) {
                    var image = $jobj(childId + '_img');
                    container px-md-5Width = $ax.getNumFromPx(image.css('width'));
                    container px-md-5Height = $ax.getNumFromPx(image.css('height'));
                    wrappedOffset.left = $ax.getNumFromPx(image.css('left'));
                    wrappedOffset.top = $ax.getNumFromPx(image.css('top'));
                } else {
                    container px-md-5Width = $ax('#' + childId).width();
                    container px-md-5Height = $ax('#' + childId).height();
                }
            }

            var container px-md-5Id = $ax.visibility.applyWidgetcontainer px-md-5(childId);
//            var container px-md-5 = _makecontainer px-md-5(container px-md-5Id, options.cull || boundingRectangle, isFullWidth, options.easing == 'flip', wrappedOffset, options.container px-md-5Exists);
            var container px-md-5 = _makecontainer px-md-5(container px-md-5Id, container px-md-5Width, container px-md-5Height, isFullWidth, options.easing == 'flip', wrappedOffset, options.container px-md-5Exists);

            if(options.containInner) {
                wrapped = _wrappedChildren(container px-md-5Exists ? $(child.children()[0]) : child);

                // Filter for visibile wrapped children
                visibleWrapped = [];
                for (var i = 0; i < wrapped.length; i++) if($ax.visibility.IsVisible(wrapped[i])) visibleWrapped.push(wrapped[i]);
                visibleWrapped = $(visibleWrapped);

                completeTotal = visibleWrapped.length;
                if(!container px-md-5Exists) container px-md-5.prependTo(child);

                // Offset items if necessary
                if(!container px-md-5Exists && (wrappedOffset.left != 0 || wrappedOffset.top != 0)) {
                    for(var i = 0; i < wrapped.length; i++) {
                        var inner = $(wrapped[i]);
                        inner.css('left', $ax.getNumFromPx(inner.css('left')) - wrappedOffset.left);
                        inner.css('top', $ax.getNumFromPx(inner.css('top')) - wrappedOffset.top);
                        // Parent layer is now size 0, so have to have to use conatiner since it's the real size.
                        //  Should we use container px-md-5 all the time? This may make things easier for fit panels too.
                        size = container px-md-5;
                    }
                }
            } else if(!container px-md-5Exists) container px-md-5.insertBefore(child);
            if(!container px-md-5Exists) wrapped.appendTo(container px-md-5);

            if (options.value && options.containInner) {
                //has to set children first because flip to show needs children invisible
                _setAllVisible(visibleWrapped, false);
                //_updateChildAlignment(childId);
                _setAllVisible(child, true);
            }
        }

        var completeCount = 0;
        var onComplete = function () {
            completeCount++;
            if (needcontainer px-md-5 && completeCount == completeTotal) {
                if ($ax.public.fn.isCompoundVectorHtml(container px-md-5.parent()[0])) {
                    wrappedOffset.left = $ax.getNumFromPx(container px-md-5.css('left'));
                    wrappedOffset.top = $ax.getNumFromPx(container px-md-5.css('top'));
                }

                if (options.containInner && !container px-md-5Exists) {
                    if (wrappedOffset.left != 0 || wrappedOffset.top != 0) {
                        for (i = 0; i < wrapped.length; i++) {
                            inner = $(wrapped[i]);
                            if (!inner.hasClass('text')) {
                                inner.css('left', $ax.getNumFromPx(inner.css('left')) + wrappedOffset.left);
                                inner.css('top', $ax.getNumFromPx(inner.css('top')) + wrappedOffset.top);
                            }
                        }
                    }

                    wrapped.filter('.text').css({ 'left': '', 'top': '' });
                }

                if(options.containInner && !options.value) {
                    _setAllVisible(child, false);
                    _setAllVisible(visibleWrapped, true);
                }

                if(container px-md-5Exists) {
                    if(!options.settingChild) container px-md-5.css('position', 'relative;');
                } else {
                    wrapped.insertBefore(container px-md-5);
                    container px-md-5.remove();
                }

                if(childObj && $ax.public.fn.IsDynamicPanel(childObj.type) && window.modifiedDynamicPanleParentOverflowProp) {
                    child.css('overflow', 'hidden');
                    window.modifiedDynamicPanleParentOverflowProp = false;
                }
            }

            //if(options.value) _updateChildAlignment(childId);

            if(!needcontainer px-md-5 || completeTotal == completeCount) {
                if(options.cull) options.cull.css('position', cullPosition);

                if(needSetSize) {
                    sizeObj.css('width', 'auto');
                    sizeObj.css('height', 'auto');
                }

                options.onComplete && options.onComplete();

                if(options.fire) {
                    $ax.event.raiseSyntheticEvent(childId, options.value ? 'onShow' : 'onHide');
                    $ax.action.fireAnimationFromQueue(childId, $ax.action.queueTypes.fade);
                }
            }
        };

        // Nothing actually being animated, all wrapped elements invisible
        if(!visibleWrapped.length) {
            if(!options.easing || options.easing == 'none') {
                $ax.visibility.SetIdVisible(childId, options.value);
                completeTotal = 1;
                onComplete();
            } else {
                window.setTimeout(function() {
                    completeCount = completeTotal - 1;
                    onComplete();
                },options.duration);
            }

            return;
        }

        if(!options.easing || options.easing == 'none') {
            $ax.visibility.SetIdVisible(childId, options.value);
            completeTotal = 1;
            onComplete();
        } else if(options.easing == 'fade') {
            if(options.value) {
                if(preserveScroll) {
                    visibleWrapped.css('opacity', 0);
                    visibleWrapped.css('visibility', 'inherit');
                    visibleWrapped.css('display', 'block');
                    //was hoping we could just use fadein here, but need to set display before set scroll position
                    _tryResumeScrollForDP(childId);
                    visibleWrapped.animate({ opacity: 1 }, {
                        duration: options.duration,
                        easing: 'swing',
                        queue: false,
                        complete: function() {
                            $ax.visibility.SetIdVisible(childId, true);
                            visibleWrapped.css('opacity', '');
                            onComplete();
                        }
                    });
                } else {
                    // Can't use $ax.visibility.SetIdVisible, because we only want to set visible, we don't want to set display, fadeIn will handle that.
                    visibleWrapped.css('visibility', 'inherit');
                    visibleWrapped.fadeIn({
                        queue: false,
                        duration: options.duration, 
                        complete: onComplete
                    });
                }
            } else {
                // Fading here is being strange...
                visibleWrapped.animate({ opacity: 0 }, { duration: options.duration, easing: 'swing', queue: false, complete: function() {
                    $ax.visibility.SetIdVisible(childId, false);
                    visibleWrapped.css('opacity', '');

                    onComplete();
                }});
            }
        } else if (options.easing == 'flip') {
            //this container px-md-5 will hold 
            var trapScroll = _trapScrollLoc(childId);
            var innercontainer px-md-5 = $('<div></div>');
            innercontainer px-md-5.attr('id', container px-md-5Id + "_inner");
            innercontainer px-md-5.data('flip', options.direction == 'left' || options.direction == 'right' ? 'y' : 'x');
            innercontainer px-md-5.css({
                position: 'relative',
                'width': container px-md-5Width,
                'height': container px-md-5Height,
                'display': 'flex'
            });

            innercontainer px-md-5.appendTo(container px-md-5);
            wrapped.appendTo(innercontainer px-md-5);

            if(childObj && $ax.public.fn.IsDynamicPanel(childObj.type)) var container px-md-5Div = child;
            else container px-md-5Div = parentId ? $jobj(parentId) : child.parent();

            completeTotal = 1;
            var flipdegree;

            var originForFlip = container px-md-5Width / 2 + 'px ' + container px-md-5Height / 2 + 'px';
            if (options.value) {
                innercontainer px-md-5.css({
                    '-webkit-transform-origin': originForFlip,
                    '-ms-transform-origin': originForFlip,
                    'transform-origin': originForFlip,
                });

                //options.value == true means in or show, note to get here, the element must be currently hidden to show,
                // we need to first flip it +/- 90deg without animation (180 if we want to show the back of the flip)
                switch(options.direction) {
                    case 'right':
                    case 'left':
                        _setRotateTransformation(innercontainer px-md-5, _getRotateString(true, options.direction === 'right', options.showFlipBack));
                        flipdegree = 'rotateY(0deg)';
                        break;
                    case 'up':
                    case 'down':
                        _setRotateTransformation(innercontainer px-md-5, _getRotateString(false, options.direction === 'up', options.showFlipBack));
                        flipdegree = 'rotateX(0deg)';
                        break;
                }

                var onFlipShowComplete = function() {
                    var trapScroll = _trapScrollLoc(childId);
                    $ax.visibility.SetIdVisible(childId, true);

                    wrapped.insertBefore(innercontainer px-md-5);
                    innercontainer px-md-5.remove();
                    trapScroll();

                    onComplete();
                };

                innercontainer px-md-5.css({
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden'
                });

                child.css({
                    'display': '',
                    'visibility': 'inherit'
                });

                visibleWrapped.css({
                    'display': '',
                    'visibility': 'inherit'
                });

                innercontainer px-md-5.css({
                    '-webkit-transition-duration': options.duration + 'ms',
                    'transition-duration': options.duration + 'ms'
                });

                if(preserveScroll) _tryResumeScrollForDP(childId);
                _setRotateTransformation(innercontainer px-md-5, flipdegree, container px-md-5Div, onFlipShowComplete, options.duration, true);
            } else { //hide or out
                innercontainer px-md-5.css({
                    '-webkit-transform-origin': originForFlip,
                    '-ms-transform-origin': originForFlip,
                    'transform-origin': originForFlip,
                });
                switch(options.direction) {
                    case 'right':
                    case 'left':
                        flipdegree = _getRotateString(true, options.direction !== 'right', options.showFlipBack);
                        break;
                    case 'up':
                    case 'down':
                        flipdegree = _getRotateString(false, options.direction !== 'up', options.showFlipBack);
                        break;
                }

                var onFlipHideComplete = function() {
                    var trapScroll = _trapScrollLoc(childId);
                    wrapped.insertBefore(innercontainer px-md-5);
                    $ax.visibility.SetIdVisible(childId, false);

                    innercontainer px-md-5.remove();
                    trapScroll();

                    onComplete();
                };

                innercontainer px-md-5.css({
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden',
                    '-webkit-transition-duration': options.duration + 'ms',
                    'transition-duration': options.duration + 'ms'
                });

                if(preserveScroll) _tryResumeScrollForDP(childId);
                _setRotateTransformation(innercontainer px-md-5, flipdegree, container px-md-5Div, onFlipHideComplete, options.duration, true);
            }

            trapScroll();
        } else {
            // Because the move is gonna fire on annotation and ref too, need to update complete total
            completeTotal = $addAll(visibleWrapped, childId).length;
            if(options.value) {
                _slideStateIn(childId, childId, options, size, false, onComplete, visibleWrapped, preserveScroll);
            } else {
                var tops = [];
                var lefts = [];
                for(var i = 0; i < visibleWrapped.length; i++) {
                    var currWrapped = $(visibleWrapped[i]);
                    
                    tops.push(fixAuto(currWrapped, 'top'));
                    lefts.push(fixAuto(currWrapped, 'left'));
                }

                var onOutComplete = function () {
                    //bring back SetIdVisible on childId for hiding lightbox
                    $ax.visibility.SetIdVisible(childId, false);
                    for(i = 0; i < visibleWrapped.length; i++) {
                        currWrapped = $(visibleWrapped[i]);
                        $ax.visibility.SetVisible(currWrapped[0], false);
                        currWrapped.css('top', tops[i]);
                        currWrapped.css('left', lefts[i]);
                    }
                    onComplete();
                };
                _slideStateOut(size, childId, options, onOutComplete, visibleWrapped);
            }
        }

        // If showing, go through all rich text objects inside you, and try to redo alignment of them
        //if(options.value && !options.containInner) {
        //    _updateChildAlignment(childId);
        //}
    };

    // IE/Safari are giving auto here instead of calculating to for us. May need to calculate this eventually, but for now we can assume auto === 0px for the edge case found
    var fixAuto = function (jobj, prop) {
        var val = jobj.css(prop);
        return val == 'auto' ? '0px' : val;
    };

    var _getRotateString = function (y, neg, showFlipBack) {
        // y means flip on y axis, or left/right, neg means flipping it left/down, and show back is for set panel state
        //  and will show the back of the widget (transparent) for the first half of a show, or second half of a hide.
        return 'rotate' + (y ? 'Y' : 'X') + '(' + (neg ? '-' : '') + (showFlipBack ? 180 : IE ? 91 : 90) + 'deg)';
    }

    //var _updateChildAlignment = function(childId) {
    //    var descendants = $jobj(childId).find('.text');
    //    for(var i = 0; i < descendants.length; i++) $ax.style.updateTextAlignmentForVisibility(descendants[i].id);
    //};
    var _wrappedChildren = function (child) {
        return child.children();
        //var children = child.children();
        //var valid = [];
        //for(var i = 0; i < children.length; i++) if($ax.visibility.IsVisible(children[i])) valid.push(children[i]);
        //return $(valid);
    };

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var _setRotateTransformation = function(elementsToSet, transformValue, elementParent, flipCompleteCallback, flipDurationMs, useAnimationFrame) {
        if(flipCompleteCallback) {
            //here we didn't use 'transitionend' event to fire callback
            //when show/hide on one element, changing transition property will stop the event from firing
            window.setTimeout(flipCompleteCallback, flipDurationMs);
        }

        var trasformCss = {
            '-webkit-transform': transformValue,
            '-moz-transform': transformValue,
            '-ms-transform': transformValue,
            '-o-transform': transformValue,
            'transform': transformValue
        };

        if(useAnimationFrame) {
            if(FIREFOX || CHROME) $('body').hide().show(0); //forces FF to render the animation            
            requestAnimationFrame(function() {
                elementsToSet.css(trasformCss);
            });
        } else elementsToSet.css(trasformCss);

        //when deal with dynamic panel, we need to set it's parent's overflow to visible to have the 3d effect
        //NOTE: we need to set this back when both flips finishes in DP, to prevents one animation finished first and set this back
        if(elementParent && elementParent.css('overflow') === 'hidden') {
            elementParent.css('overflow', 'visible');
            window.modifiedDynamicPanleParentOverflowProp = true;
        }
    };

    $ax.visibility.GetPanelState = function(id) {
        var children = $ax.visibility.getRealChildren($jobj(id).children());
        for(var i = 0; i < children.length; i++) {
            if(children[i].style && $ax.visibility.IsVisible(children[i])) return children[i].id;
        }
        return '';
    };

    var container px-md-5Count = {};
    $ax.visibility.SetPanelState = function(id, stateId, easingOut, directionOut, durationOut, easingIn, directionIn, durationIn, showWhenSet) {
        var show = !$ax.visibility.IsIdVisible(id) && showWhenSet;
        if(show) $ax.visibility.SetIdVisible(id, true);

        // Exit here if already at desired state.
        if($ax.visibility.IsIdVisible(stateId)) {
            if(show) {
                $ax.event.raiseSyntheticEvent(id, 'onShow');
                // If showing size changes and need to update parent panels
                $ax.dynamicPanelManager.fitParentPanel(id);
            }

            $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.setState);
            return;
        }

        var hasEasing = easingIn != 'none' || easingOut != 'none';
        if(hasEasing) _pushcontainer px-md-5(id, true);

        var state = $jobj(stateId);
        var oldStateId = $ax.visibility.GetPanelState(id);
        var oldState = $jobj(oldStateId);

        var isFixed = $jobj(id).css('position') == 'fixed';
        //pin to browser
        if(isFixed) $ax.dynamicPanelManager.adjustFixed(id, oldState.width(), oldState.height(), state.width(), state.height());

        _bringPanelStateToFront(id, stateId, oldStateId, easingIn == 'none' || durationIn == '0');

        var fitToContent = $ax.dynamicPanelManager.isIdFitToContent(id);
        var resized = false;
        if(fitToContent) {
            // Set resized
            //var width = state.width();
            //var height = state.height();
            var newBoundingRect = $ax('#' + stateId).childrenBoundingRect();
            var width = newBoundingRect.right;
            var height = newBoundingRect.bottom;
            var oldBoundingRect = $ax('#' + id).size();
            var oldWidth = oldBoundingRect.right;
            var oldHeight = oldBoundingRect.bottom;
            resized = width != oldWidth || height != oldHeight;
            //resized = width != oldState.width() || height != oldState.height();

            $ax.visibility.setResizedSize(id, $obj(id).percentWidth ? oldWidth : width, height);
        }

        //edge case for sliding
        var movement = (directionOut == 'left' || directionOut == 'up' || state.children().length == 0) && oldState.children().length != 0 ? oldState : state;
        var onCompleteCount = 0;
        var onComplete = function () {
            //move this call from _setVisibility() for animate out.
            //Because this will make the order of dp divs consistence: the showing panel is always in front after both animation finished
            //tested in the cases where one panel is out/show slower/faster/same time/instantly. 
            _bringPanelStateToFront(id, stateId, oldStateId, false);

            if (window.modifiedDynamicPanleParentOverflowProp) {
                var parent = id ? $jobj(id) : child.parent();
                parent.css('overflow', 'hidden');
                window.modifiedDynamicPanleParentOverflowProp = false;
            }

            $ax.dynamicPanelManager.fitParentPanel(id);
            $ax.dynamicPanelManager.updatePanelPercentWidth(id);
            $ax.dynamicPanelManager.updatePanelContentPercentWidth(id);
            $ax.action.fireAnimationFromQueue(id, $ax.action.queueTypes.setState);
            $ax.event.raiseSyntheticEvent(id, "onPanelStateChange");
            $ax.event.leavingState(oldStateId);
            if (hasEasing) _popcontainer px-md-5(id, true);

            $ax.dynamicPanelManager.updateMobileScroll(id, stateId);
        };
        // Must do state out first, so if we cull by new state, location is correct
        _setVisibility(id, oldStateId, {
            value: false,
            easing: easingOut,
            direction: directionOut,
            duration: durationOut,
            container px-md-5Exists: true,
            onComplete: function() {
//                if(easingIn !== 'flip') _bringPanelStateToFront(id, stateId);
                if (++onCompleteCount == 2) onComplete();
            },
            settingChild: true,
            size: movement,
            //cull for 
            cull: easingOut == 'none' || state.children().length == 0 ? oldState : state,
            showFlipBack: true
        });

        _setVisibility(id, stateId, {
            value: true,
            easing: easingIn,
            direction: directionIn,
            duration: durationIn,
            container px-md-5Exists: true,
            onComplete: function () {
//                if (easingIn === 'flip') _bringPanelStateToFront(id, stateId);
                if (++onCompleteCount == 2) onComplete();
            },
            settingChild: true,
            //size for offset
            size: movement,
            showFlipBack: true
        });

        if(show) $ax.event.raiseSyntheticEvent(id, 'onShow');
        if(resized) $ax.event.raiseSyntheticEvent(id, 'onResize');
    };

    var containedFixed = {};
    var _pushcontainer px-md-5 = _visibility.pushcontainer px-md-5 = function(id, panel) {
        var count = container px-md-5Count[id];
        if(count) container px-md-5Count[id] = count + 1;
        else {
            var trapScroll = _trapScrollLoc(id);
            var jobj = $jobj(id);
            var children = jobj.children();
            var css = {
                position: 'relative',
                top: 0,
                left: 0
            };

            if(!panel) {
                var boundingRect = $ax('#' + id).offsetBoundingRect();
                //var boundingRect = $axure.fn.getWidgetBoundingRect(id);
                css.top = boundingRect.top;
                css.left = boundingRect.left;
            }

            var container px-md-5 = $('<div></div>');
            container px-md-5.attr('id', ''); // Placeholder id, so we won't try to recurse the container px-md-5 until it is ready
            container px-md-5.css(css);
            //container px-md-5.append(jobj.children());
            jobj.append(container px-md-5);
            container px-md-5Count[id] = 1;

            // Panel needs to wrap children
            if(panel) {
                for(var i = 0; i < children.length; i++) {
                    var child = $(children[i]);
                    var childcontainer px-md-5 = $('<div></div>');
                    childcontainer px-md-5.attr('id', $ax.visibility.applyWidgetcontainer px-md-5(child.attr('id')));
                    childcontainer px-md-5.css(css);
                    child.after(childcontainer px-md-5);
                    childcontainer px-md-5.append(child);
                    container px-md-5.append(childcontainer px-md-5);
                }
            } else {
                var focus = _getCurrFocus();
                if(focus) $ax.event.addSuppressedEvent($ax.repeater.removeSuffixFromElementId(focus), 'OnLostFocus');

                // Layer needs to fix top left
                var childIds = $ax('#' + id).getChildren()[0].children;
                for(var i = 0; i < childIds.length; i++) {
                    var childId = childIds[i];
                    var childObj = $jobj(childId);
                    var fixedInfo = $ax.dynamicPanelManager.getFixedInfo(childId);
                    if(fixedInfo.fixed) {
                        var axObj = $ax('#' + childId);
                        var viewportLocation = axObj.viewportLocation();
                        var left = viewportLocation.left;
                        var top = viewportLocation.top;
                        //var left = axObj.left();
                        //var top = axObj.top();
                        containedFixed[childId] = { left: left, top: top, fixed: fixedInfo };
                        childObj.css('left', left);
                        childObj.css('top', top);
                        childObj.css('margin-left', 0);
                        childObj.css('margin-top', 0);
                        childObj.css('right', 'auto');
                        childObj.css('bottom', 'auto');
                        childObj.css('position', 'absolute');
                    }
                    var cssChange = {
                        left: '-=' + css.left,
                        top: '-=' + css.top
                    };
                    if($ax.getTypeFromElementId(childId) == $ax.constants.LAYER_TYPE) {
                        _pushcontainer px-md-5(childId, false);
                        $ax.visibility.applyWidgetcontainer px-md-5(childId, true).css(cssChange);
                    } else {
                        //if ($ax.public.fn.isCompoundVectorHtml(jobj[0])) {
                        //    var grandChildren = jobj[0].children;
                        //    //while (grandChildren.length > 0 && grandChildren[0].id.indexOf('container px-md-5') >= 0) grandChildren = grandChildren[0].children;

                        //    for (var j = 0; j < grandChildren.length; j++) {
                        //        var grandChildId = grandChildren[j].id;
                        //        if (grandChildId.indexOf(childId + 'p') >= 0 || grandChildId.indexOf('_container px-md-5') >= 0) $jobj(grandChildId).css(cssChange);
                        //    }
                        //} else 
                        // Need to include ann and ref in move.
                        childObj = $addAll(childObj, childId);
                        childObj.css(cssChange);
                    }

                    container px-md-5.append(childObj);
                }
                _setCurrFocus(focus);
            }
            container px-md-5.attr('id', $ax.visibility.applyWidgetcontainer px-md-5(id)); // Setting the correct final id for the container px-md-5
            trapScroll();
        }
    };

    var _popcontainer px-md-5 = _visibility.popcontainer px-md-5 = function (id, panel) {
        var count = container px-md-5Count[id];
        if(!count) return;
        count--;
        container px-md-5Count[id] = count;
        if(count != 0) return;

        var trapScroll = _trapScrollLoc(id);

        var jobj = $jobj(id);
        var container px-md-5 = $ax.visibility.applyWidgetcontainer px-md-5(id, true);

        // If layer is at bottom or right of page, unwrapping could change scroll by temporarily reducting page size.
        //  To avoid this, we let container px-md-5 persist on page, with the size it is at this point, and don't remove container px-md-5 completely
        //  until the children are back to their proper locations.
        var size = $ax('#' + id).size();
        container px-md-5.css('width', size.width);
        container px-md-5.css('height', size.height);
        var focus = _getCurrFocus();
        if(focus) $ax.event.addSuppressedEvent($ax.repeater.removeSuffixFromElementId(focus), 'OnLostFocus');
        jobj.append(container px-md-5.children());
        _setCurrFocus(focus);
        $('body').first().append(container px-md-5);

        // Layer doesn't have children container px-md-5s to clean up
        if(panel) {
            var children = jobj.children();
            for(var i = 0; i < children.length; i++) {
                var childcontainer px-md-5 = $(children[i]);
                var child = $(childcontainer px-md-5.children()[0]);
                childcontainer px-md-5.after(child);
                childcontainer px-md-5.remove();
            }
        } else {
            var left = container px-md-5.css('left');
            var top = container px-md-5.css('top');
            var childIds = $ax('#' + id).getChildren()[0].children;
            for (var i = 0; i < childIds.length; i++) {
                var childId = childIds[i];
                var cssChange = {
                    left: '+=' + left,
                    top: '+=' + top
                };
                if($ax.getTypeFromElementId(childId) == $ax.constants.LAYER_TYPE) {
                    $ax.visibility.applyWidgetcontainer px-md-5(childId, true).css(cssChange);
                    _popcontainer px-md-5(childId, false);
                } else {
                    var childObj = $jobj(childId);
                    //    if ($ax.public.fn.isCompoundVectorHtml(jobj[0])) {
                    //        var grandChildren = jobj[0].children;
                    //        //while (grandChildren.length > 0 && grandChildren[0].id.indexOf('container px-md-5') >= 0) grandChildren = grandChildren[0].children;
                    //        for (var j = 0; j < grandChildren.length; j++) {
                    //            var grandChildId = grandChildren[j].id;
                    //            if (grandChildId.indexOf(childId + 'p') >= 0 || grandChildId.indexOf('_container px-md-5') >= 0) $jobj(grandChildId).css(cssChange);
                    //        }
                    //} else
                    
                    var allObjs = $addAll(childObj, childId); // Just include other objects for initial css. Fixed panels need to be dealt with separately.
                    allObjs.css(cssChange);

                    var fixedInfo = containedFixed[childId];
                    if(fixedInfo) {
                        delete containedFixed[childId];

                        childObj.css('position', 'fixed');
                        var deltaX = $ax.getNumFromPx(childObj.css('left')) - fixedInfo.left;
                        var deltaY = $ax.getNumFromPx(childObj.css('top')) - fixedInfo.top;

                        fixedInfo = fixedInfo.fixed;
                        if(fixedInfo.horizontal == 'left') childObj.css('left', fixedInfo.x + deltaX);
                        else if(fixedInfo.horizontal == 'center') {
                            childObj.css('left', '50%');
                            childObj.css('margin-left', fixedInfo.x + deltaX);
                        } else {
                            childObj.css('left', 'auto');
                            childObj.css('right', fixedInfo.x - deltaX);
                        }

                        if(fixedInfo.vertical == 'top') childObj.css('top', fixedInfo.y + deltaY);
                        else if(fixedInfo.vertical == 'middle') {
                            childObj.css('top', '50%');
                            childObj.css('margin-top', fixedInfo.y + deltaY);
                        } else {
                            childObj.css('top', 'auto');
                            childObj.css('bottom', fixedInfo.y - deltaY);
                        }

                        $ax.dynamicPanelManager.updatePanelPercentWidth(childId);
                        $ax.dynamicPanelManager.updatePanelContentPercentWidth(childId);

                    }
                }
            }
        }
        container px-md-5.remove();
        trapScroll();
    };

    var _trapScrollLoc = function(id) {
        var locs = {};
        var states = $jobj(id).find('.panel_state');
        for(var i = 0; i < states.length; i++) {
            var state = $(states[i]);
            locs[state.attr('id')] = { x: state.scrollLeft(), y: state.scrollTop() };
        }
        return function() {
            for(var key in locs) {
                var state = $jobj(key);
                state.scrollLeft(locs[key].x);
                state.scrollTop(locs[key].y);
            }
        };
    }

    var _getCurrFocus = function () {
        // Only care about focused a tags and inputs
        var id = window.lastFocusedClickable && window.lastFocusedClickable.id;

        if(!id) return id;
        var jobj = $(window.lastFocusedClickable);
        return jobj.is('a') || jobj.is('input') ? id : '';
    }

    var _setCurrFocus = function(id) {
        if(id) {
            // This is really just needed for IE, so if this causes issues on other browsers, try adding that check here
            var trap = $ax.event.blockEvent($ax.repeater.removeSuffixFromElementId(id), 'OnFocus');
            window.setTimeout(function () {
                $jobj(id).focus();
                trap();
            }, 0);
        }
    }

    //use this to save & restore DP's scroll position when show/hide
    //key => dp's id (not state's id, because it seems we can change state while hiding)
    //value => first state's id & scroll position
    //we only need to store one scroll position for one DP, and remove the key after shown.
    var DPStateAndScroll = {}
    var _tryResumeScrollForDP = function (dpId, deleteId) {
        var scrollObj = DPStateAndScroll[dpId];
        if(scrollObj) {
            var shownState = document.getElementById(scrollObj.shownId);
            if(scrollObj.left) shownState.scrollLeft = scrollObj.left;
            if(scrollObj.top) shownState.scrollTop = scrollObj.top;
            if(deleteId) delete DPStateAndScroll[dpId];
        }
    };
//    var _makecontainer px-md-5 = function (container px-md-5Id, rect, isFullWidth, isFlip, offset, container px-md-5Exists) {
    var _makecontainer px-md-5 = function (container px-md-5Id, width, height, isFullWidth, isFlip, offset, container px-md-5Exists) {
        if(container px-md-5Exists) var container px-md-5 = $jobj(container px-md-5Id);
        else {
            container px-md-5 = $('<div></div>');
            container px-md-5.attr('id', container px-md-5Id);
        }
        var css = {
            position: 'absolute',
            width: width,
            height: height,
            display: 'flex'
        };

        if(!container px-md-5Exists) {
            // If container px-md-5 exists, may be busy updating location. Will init and update it correctly.
            css.top = offset.top;
            css.left = offset.left;
        }


        if(isFlip) {
            css.perspective = '800px';
            css.webkitPerspective = "800px";
            css.mozPerspective = "800px";
            //adding this to make Edge happy
            css['transform-style'] = 'preserve-3d';
        } else css.overflow = 'hidden';

        //perspective on container px-md-5 will give us 3d effect when flip
        //if(!isFlip) css.overflow = 'hidden';

        // Rect should be a jquery not axquery obj
        //_getFixedCss(css, rect.$ ? rect.$() : rect, fixedInfo, isFullWidth);
        
        container px-md-5.css(css);
        return container px-md-5;
    };

    var container px-md-5_SUFFIX = _visibility.container px-md-5_SUFFIX = '_container px-md-5';
    var container px-md-5_INNER = container px-md-5_SUFFIX + '_inner';
    _visibility.getWidgetFromcontainer px-md-5 = function(id) {
        var container px-md-5Index = id.indexOf(container px-md-5_SUFFIX);
        if(container px-md-5Index == -1) return id;
        return id.substr(0, container px-md-5Index) + id.substr(container px-md-5Index + container px-md-5_SUFFIX.length);
    };

    // Apply container px-md-5 to widget id if necessary.
    // returnJobj: True if you want the jquery object rather than id returned
    // skipCheck: True if you want the query returned reguardless of container px-md-5 existing
    // checkInner: True if inner container px-md-5 should be checked
    _visibility.applyWidgetcontainer px-md-5 = function (id, returnJobj, skipCheck, checkInner) {
        // If container px-md-5 exists, just return (return query if requested)
        if(id.indexOf(container px-md-5_SUFFIX) != -1) return returnJobj ? $jobj(id) : id;

        // Get desired id, and return it if query is not desired
        var container px-md-5Id = $ax.repeater.applySuffixToElementId(id, checkInner ? container px-md-5_INNER : container px-md-5_SUFFIX);
        if(!returnJobj) return container px-md-5Id;

        // If skipping check or container px-md-5 exists, just return innermost container px-md-5 requested
        var container px-md-5 = $jobj(container px-md-5Id);
        if(skipCheck || container px-md-5.length) return container px-md-5;
        // If inner container px-md-5 was not checked, then no more to check, return query for widget
        if(!checkInner) return $jobj(id);

        // If inner container px-md-5 was checked, check for regular container px-md-5 still
        container px-md-5 = $jobj($ax.repeater.applySuffixToElementId(id, container px-md-5_SUFFIX));
        return container px-md-5.length ? container px-md-5 : $jobj(id);
    };

    _visibility.iscontainer px-md-5 = function(id) {
        return id.indexOf(container px-md-5_SUFFIX) != -1;
    };

    _visibility.getRealChildren = function(query) {
        while(query.length && $(query[0]).attr('id').indexOf(container px-md-5_SUFFIX) != -1) query = query.children();
        return query;
    };

    //var _getFixedCss = function(css, rect, fixedInfo, isFullWidth) {
    //    // todo: **mas** make sure this is ok
    //    if(fixedInfo.fixed) {
    //        css.position = 'fixed';

    //        if(fixedInfo.horizontal == 'left') css.left = fixedInfo.x;
    //        else if(fixedInfo.horizontal == 'center') {
    //            css.left = isFullWidth ? '0px' : '50%';
    //            css['margin-left'] = fixedInfo.x;
    //        } else if(fixedInfo.horizontal == 'right') {
    //            css.left = 'auto';
    //            css.right = fixedInfo.x;
    //        }

    //        if(fixedInfo.vertical == 'top') css.top = fixedInfo.y;
    //        else if(fixedInfo.vertical == 'middle') {
    //            css.top = '50%';
    //            css['margin-top'] = fixedInfo.y;
    //        } else if(fixedInfo.vertical == 'bottom') {
    //            css.top = 'auto';
    //            css.bottom = fixedInfo.y;
    //        }
    //    } else {
    //        css.left = Number(rect.css('left').replace('px', '')) || 0;
    //        css.top = Number(rect.css('top').replace('px', '')) || 0;
    //    }
    //};

    var _slideStateOut = function (container px-md-5, stateId, options, onComplete, jobj) {
        var directionOut = options.direction;
        var axObject = $ax('#' + container px-md-5.attr('id'));
        var width = axObject.width();
        var height = axObject.height();

        _blockSetMoveIds = true;

        if(directionOut == "right") {
            $ax.move.MoveWidget(stateId, width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionOut == "left") {
            $ax.move.MoveWidget(stateId, -width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionOut == "up") {
            $ax.move.MoveWidget(stateId, 0, -height, options, false, onComplete, false, jobj, true);
        } else if(directionOut == "down") {
            $ax.move.MoveWidget(stateId, 0, height, options, false, onComplete, false, jobj, true);
        }

        _blockSetMoveIds = false;
    };

    var _slideStateIn = function (id, stateId, options, container px-md-5, makePanelVisible, onComplete, jobj, preserveScroll) {
        var directionIn = options.direction;
        var axObject = $ax('#' +container px-md-5.attr('id'));
        var width = axObject.width();
        var height = axObject.height();

        if (makePanelVisible) $ax.visibility.SetIdVisible(id, true);
        for (i = 0; i < jobj.length; i++) $ax.visibility.SetVisible(jobj[i], true);

        for(var i = 0; i < jobj.length; i++) {
            var child = $(jobj[i]);
            var oldTop = $ax.getNumFromPx(fixAuto(child, 'top'));
            var oldLeft = $ax.getNumFromPx(fixAuto(child, 'left'));
            if (directionIn == "right") {
                child.css('left', oldLeft - width + 'px');
            } else if(directionIn == "left") {
                child.css('left', oldLeft + width + 'px');
            } else if(directionIn == "up") {
                child.css('top', oldTop + height + 'px');
            } else if(directionIn == "down") {
                child.css('top', oldTop - height + 'px');
            }
        }

        if(preserveScroll) _tryResumeScrollForDP(id);

        _blockSetMoveIds = true;

        if(directionIn == "right") {
            $ax.move.MoveWidget(stateId, width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionIn == "left") {
            $ax.move.MoveWidget(stateId, -width, 0, options, false, onComplete, false, jobj, true);
        } else if(directionIn == "up") {
            $ax.move.MoveWidget(stateId, 0, -height, options, false, onComplete, false, jobj, true);
        } else if(directionIn == "down") {
            $ax.move.MoveWidget(stateId, 0, height, options, false, onComplete, false, jobj, true);
        }

        _blockSetMoveIds = false;
    };

    $ax.visibility.GetPanelStateId = function(dpId, index) {
        var itemNum = $ax.repeater.getItemIdFromElementId(dpId);
        var panelStateId = $ax.repeater.getScriptIdFromElementId(dpId) + '_state' + index;
        return $ax.repeater.createElementId(panelStateId, itemNum);
    };

    $ax.visibility.GetPanelStateCount = function(id) {
        return $ax.visibility.getRealChildren($jobj(id).children()).filter("[id*='_state']").length;
    };

    var _bringPanelStateToFront = function (dpId, stateId, oldStateId, oldInFront) {
        var panel = $jobj(dpId);
        var frontId = oldInFront ? oldStateId : stateId;
        if(container px-md-5Count[dpId]) {
            frontId = $ax.visibility.applyWidgetcontainer px-md-5(frontId);
            panel = $ax.visibility.applyWidgetcontainer px-md-5(dpId, true, false, true);
        }
        $jobj(frontId).appendTo(panel);
        //when bring a panel to front, it will be focused, and the previous front panel should fire blur event if it's lastFocusedClickableSelector
        //ie(currently 11) and firefox(currently 34) doesn't fire blur event, this is the hack to fire it manually
        if((IE || FIREFOX) && window.lastFocusedClickable && $ax.event.getFocusableWidgetOrChildId(window.lastFocusedControl) == window.lastFocusedClickable.id) {
            // Only need to do this if the currently focused widget is in the panel state that is being hidden.
            if($jobj(oldStateId).find('#' + window.lastFocusedClickable.id.split('_')[0]).length) $(window.lastFocusedClickable).triggerHandler('blur');
        }
    };

    var _limboIds = _visibility.limboIds = {};
    // limboId's is a dictionary of id->true, essentially a set.
    var _addLimboAndHiddenIds = $ax.visibility.addLimboAndHiddenIds = function(newLimboIds, newHiddenIds, query, skipRepeater) {
        var limboedByMaster = {};
        for(var key in newLimboIds) {
            if (!$ax.public.fn.IsReferenceDiagramObject($ax.getObjectFromElementId(key).type)) continue;
            var ids = $ax.model.idsInRdoToHideOrLimbo(key);
            for(var i = 0; i < ids.length; i++) limboedByMaster[ids[i]] = true;
        }

        var hiddenByMaster = {};
        for(key in newHiddenIds) {
            if (!$ax.public.fn.IsReferenceDiagramObject($ax.getObjectFromElementId(key).type)) continue;
            ids = $ax.model.idsInRdoToHideOrLimbo(key);
            for(i = 0; i < ids.length; i++) hiddenByMaster[ids[i]] = true;
        }

        // Extend with children of rdos
        newLimboIds = $.extend(newLimboIds, limboedByMaster);
        newHiddenIds = $.extend(newHiddenIds, hiddenByMaster);

        // something is only visible if it's not hidden and limboed
        query.each(function(diagramObject, elementId) {
            // Rdos already handled, contained widgets are limboed by the parent, and sub menus should be ignored
            if(diagramObject.isContained || $ax.public.fn.IsReferenceDiagramObject(diagramObject.type) || $ax.public.fn.IsTableCell(diagramObject.type) || $jobj(elementId).hasClass('sub_menu')) return;
            if(diagramObject.type == 'table' && $jobj(elementId).parent().hasClass('ax_menu')) return;
            if(skipRepeater) {
                // Any item in a repeater should return
                if($ax.getParentRepeaterFromElementIdExcludeSelf(elementId)) return;
            }

            var scriptId = $ax.repeater.getScriptIdFromElementId(elementId);
            var shouldBeVisible = Boolean(!newLimboIds[scriptId] && !newHiddenIds[scriptId]);
            var isVisible = Boolean(_isIdVisible(elementId));
            if(shouldBeVisible != isVisible) {
                _setWidgetVisibility(elementId, { value: shouldBeVisible, nocontainer px-md-5: true });
            }
        });

        _limboIds = _visibility.limboIds = $.extend(_limboIds, newLimboIds);

    };

    var _clearLimboAndHidden = $ax.visibility.clearLimboAndHidden = function(ids) {
        _limboIds = _visibility.limboIds = {};
    };

    $ax.visibility.clearLimboAndHiddenIds = function(ids) {
        for(var i = 0; i < ids.length; i++) {
            var scriptId = $ax.repeater.getScriptIdFromElementId(ids[i]);
            delete _limboIds[scriptId];
        }
    };

    $ax.visibility.resetLimboAndHiddenToDefaults = function (query) {
        if(!query) query = $ax('*');
        _clearLimboAndHidden();
        _addLimboAndHiddenIds(_defaultLimbo, _defaultHidden, query);
    };

    $ax.visibility.isScriptIdLimbo = function(scriptId) {
        if(_limboIds[scriptId]) return true;

        var repeater = $ax.getParentRepeaterFromScriptId(scriptId);
        if(!repeater) return false;

        var itemId = $ax.getItemIdsForRepeater(repeater)[0];
        return _limboIds[$ax.repeater.createElementId(scriptId, itemId)];
    }

    $ax.visibility.isElementIdLimboOrInLimbocontainer px-md-5 = function (elementId) {
        var parent = document.getElementById(elementId);
        while(parent) {
            var scriptId = $ax.repeater.getScriptIdFromElementId($(parent).attr('id'));
            if(_limboIds[scriptId]) return true;
            parent = parent.parentElement;
        }
        return false;
    }

    var _blockSetMoveIds = false;
    var _movedIds = _visibility.movedIds = {};
    var _resizedIds = _visibility.resizedIds = {};
    var _rotatedIds = _visibility.rotatedIds = {};

    $ax.visibility.getMovedLocation = function(scriptId) {
        return _movedIds[scriptId];

        //var repeater = $ax.getParentRepeaterFromScriptId(scriptId);
        //if (!repeater) return false;

        //var itemId = $ax.getItemIdsForRepeater(repeater)[0];
        //return _movedIds[$ax.repeater.createElementId(scriptId, itemId)];
    };

    $ax.visibility.setMovedLocation = function (scriptId, left, top) {
        if ($jobj(scriptId).css('position') == 'fixed') return;
        _movedIds[scriptId] = { left: left, top: top };
    };

    $ax.visibility.moveMovedLocation = function (scriptId, deltaLeft, deltaTop) {
        if(_blockSetMoveIds) return false;

        var offsetLocation = $ax('#' + scriptId).offsetLocation();
        $ax.visibility.setMovedLocation(scriptId, offsetLocation.x + deltaLeft, offsetLocation.y + deltaTop);

        if($ax.getTypeFromElementId(scriptId) == $ax.constants.LAYER_TYPE) {
            var childIds = $ax('#' + scriptId).getChildren()[0].children;
            for (var i = 0; i < childIds.length; i++) {
                $ax.visibility.moveMovedLocation(childIds[i], deltaLeft, deltaTop);
            }
        }
    };

    $ax.visibility.getResizedSize = function(scriptId) {
        return _resizedIds[scriptId];

        //var repeater = $ax.getParentRepeaterFromScriptId(scriptId);
        //if (!repeater) return false;

        //var itemId = $ax.getItemIdsForRepeater(repeater)[0];
        //return _resizedIds[$ax.repeater.createElementId(scriptId, itemId)];
    };

    $ax.visibility.setResizedSize = function(scriptId, width, height) {
        _resizedIds[scriptId] = { width: width, height: height };
    };

    $ax.visibility.getRotatedAngle = function (scriptId) {
        return _rotatedIds[scriptId];
    };

    $ax.visibility.setRotatedAngle = function (scriptId, rotation) {
        _rotatedIds[scriptId] = rotation;
    };

    $ax.visibility.clearMovedAndResized = function () {
        _movedIds = _visibility.movedIds = {};
        _resizedIds = _visibility.resizedIds = {};
        _rotatedIds = _visibility.rotatedIds = {};
    };

    $ax.visibility.clearMovedAndResizedIds = function (elementIds) {
        for (var i = 0; i < elementIds.length; i++) {
            var id = elementIds[i];
            delete _movedIds[id];
            delete _resizedIds[id];
            delete _rotatedIds[id];
        }
    };

    $ax.visibility.initialize = function() {
        // initialize initial visible states
        $('.' + HIDDEN_CLASS).each(function (index, diagramObject) {
            _defaultHidden[$ax.repeater.getScriptIdFromElementId(diagramObject.id)] = true;
        });

        $('.' + UNPLACED_CLASS).each(function (index, diagramObject) {
            _defaultLimbo[$ax.repeater.getScriptIdFromElementId(diagramObject.id)] = true;
        });

        _addLimboAndHiddenIds(_defaultLimbo, _defaultHidden, $ax('*'), true);
    };

    _visibility.initRepeater = function(repeaterId) {
        var html = $('<div></div>');
        html.append($jobj(repeaterId + '_script').html());

        html.find('.' + HIDDEN_CLASS).each(function (index, element) {
            _defaultHidden[$ax.repeater.getScriptIdFromElementId(element.id)] = true;
        });

        html.find('.' + UNPLACED_CLASS).each(function (index, element) {
            _defaultLimbo[$ax.repeater.getScriptIdFromElementId(element.id)] = true;
        });
    }

    var HIDDEN_CLASS = _visibility.HIDDEN_CLASS = 'ax_default_hidden';
    var UNPLACED_CLASS = _visibility.UNPLACED_CLASS = 'ax_default_unplaced';

});