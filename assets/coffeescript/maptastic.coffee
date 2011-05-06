jQuery ($) ->
    $.widget "Kasmanaft.MaptasticMap",

        options:
            latitude : 'latitude'
            longitude : 'longitude'
            zoom : 'zoom'
            mapType : google.maps.MapTypeId.ROADMAP
            defaultLatitude : 37.0625
            defaultLongitude : -95.677068
            defaultZoom : 4
            initialize : false


        _create: ->
            if $('#'+@options.latitude).val()!='' && $('#'+@options.longitude).val()!=''
                @marker_flag = true
                this._updateLocation [$('#'+@options.latitude).val(), $('#'+@options.longitude).val()]
            else if navigator.geolocation
                navigator.geolocation.getCurrentPosition(
                    (position)=>
                        this._updateLocation [position.coords.latitude, position.coords.longitude]
                        @zoom = 10
                    (error)->
                        # Not found in safari/iMac
                        false
                    maximumAge : Infinity
                    timeout : 10000
                )

            this._updateLocation [@options.defaultLatitude, @options.defaultLongitude] unless @latitude && @longitude

            @zoom ?= if $('#'+@options.zoom).val()!='' then $('#'+@options.zoom).val() else @options.defaultZoom
            this._updateZoom()


        reload: ->
            google.maps.event.clearInstanceListeners @map if @map
            opts =
                zoom: @zoom
                mapTypeId: @options.mapType

            @map = new google.maps.Map document.getElementById(this.element.attr('id')), opts
            @map.setCenter @location
            this._setMarker(@location) if @marker_flag
            google.maps.event.addListener @map, 'click', (event)=>
                this._updateLocation [ event.latLng.lat(), event.latLng.lng()]
                this._setMarker event.latLng
                @marker_flag = true
            google.maps.event.addListener @map, 'zoom_changed', =>
                @zoom = @map.getZoom()
                this._updateZoom()

        hide: ->
            google.maps.event.clearInstanceListeners @map
            delete @marker
            delete @map

        _updateLocation: (location)->
            [@latitude, @longitude ] = location
            $('#'+@options.latitude).val @latitude
            $('#'+@options.longitude).val @longitude
            @location = new google.maps.LatLng @latitude, @longitude

        _updateZoom: ->
            $('#'+@options.zoom).val @zoom


        _setMarker: (location)->
            this._createMarker(location) unless @marker
            @marker.setPosition location

        _createMarker: (location)->
            @marker = new google.maps.Marker
                    map: @map
                    title: 'Drag to reposition'
                    draggable: true
            google.maps.event.addListener @marker, 'dragend', (event) =>
                    this._updateLocation [ event.latLng.lat(), event.latLng.lng()]
