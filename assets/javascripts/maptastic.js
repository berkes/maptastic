/* DO NOT MODIFY. This file was compiled Thu, 05 May 2011 23:59:19 GMT from
 * /Users/kasmanaft/Sites/roadangels/app/coffeescripts/maptastic.coffee
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jQuery(function($) {
    return $.widget("Kasmanaft.MaptasticMap", {
      options: {
        latitude: 'latitude',
        longitude: 'longitude',
        zoom: 'zoom',
        mapType: google.maps.MapTypeId.ROADMAP,
        defaultLatitude: 37.0625,
        defaultLongitude: -95.677068,
        defaultZoom: 4,
        initialize: false
      },
      _create: function() {
        var _ref;
        if ($('#' + this.options.latitude).val() !== '' && $('#' + this.options.longitude).val() !== '') {
          this.marker_flag = true;
          this._updateLocation([$('#' + this.options.latitude).val(), $('#' + this.options.longitude).val()]);
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(__bind(function(position) {
            this._updateLocation([position.coords.latitude, position.coords.longitude]);
            return this.zoom = 10;
          }, this), function(error) {
            return false;
          }, {
            maximumAge: Infinity,
            timeout: 10000
          });
        }
        if (!(this.latitude && this.longitude)) {
          this._updateLocation([this.options.defaultLatitude, this.options.defaultLongitude]);
        }
                if ((_ref = this.zoom) != null) {
          _ref;
        } else {
          this.zoom = $('#' + this.options.zoom).val() !== '' ? $('#' + this.options.zoom).val() : this.options.defaultZoom;
        };
        return this._updateZoom();
      },
      reload: function() {
        var opts;
        if (this.map) {
          google.maps.event.clearInstanceListeners(this.map);
        }
        opts = {
          zoom: this.zoom,
          mapTypeId: this.options.mapType
        };
        this.map = new google.maps.Map(document.getElementById(this.element.attr('id')), opts);
        this.map.setCenter(this.location);
        if (this.marker_flag) {
          this._setMarker(this.location);
        }
        google.maps.event.addListener(this.map, 'click', __bind(function(event) {
          this._updateLocation([event.latLng.lat(), event.latLng.lng()]);
          this._setMarker(event.latLng);
          return this.marker_flag = true;
        }, this));
        return google.maps.event.addListener(this.map, 'zoom_changed', __bind(function() {
          this.zoom = this.map.getZoom();
          return this._updateZoom();
        }, this));
      },
      hide: function() {
        google.maps.event.clearInstanceListeners(this.map);
        delete this.marker;
        return delete this.map;
      },
      _updateLocation: function(location) {
        this.latitude = location[0], this.longitude = location[1];
        $('#' + this.options.latitude).val(this.latitude);
        $('#' + this.options.longitude).val(this.longitude);
        return this.location = new google.maps.LatLng(this.latitude, this.longitude);
      },
      _updateZoom: function() {
        return $('#' + this.options.zoom).val(this.zoom);
      },
      _setMarker: function(location) {
        if (!this.marker) {
          this._createMarker(location);
        }
        return this.marker.setPosition(location);
      },
      _createMarker: function(location) {
        this.marker = new google.maps.Marker({
          map: this.map,
          title: 'Drag to reposition',
          draggable: true
        });
        return google.maps.event.addListener(this.marker, 'dragend', __bind(function(event) {
          return this._updateLocation([event.latLng.lat(), event.latLng.lng()]);
        }, this));
      }
    });
  });
}).call(this);
