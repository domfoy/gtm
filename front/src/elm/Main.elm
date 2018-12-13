port module Main exposing (Entry, Model, Msg(..), createSocket, decodeEntry, entryDecoder, init, main, newEntry, subscriptions, update, view, viewEntry)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode
import Json.Decode.Pipeline as PipelineDecoder


type alias Entry =
    { tagLines : List String, year : String }


type alias Model =
    { entry : Maybe Entry }


type Msg
    = JoinGame
    | NewEntry (Result Json.Decode.Error Entry)


init : () -> ( Model, Cmd Msg )
init =
    \_ -> ( { entry = Nothing }, Cmd.none )


port createSocket : () -> Cmd msg


port newEntry : (Json.Decode.Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    newEntry (decodeEntry >> NewEntry)


update msg model =
    case msg of
        JoinGame ->
            ( model, createSocket () )

        NewEntry (Err err) ->
            ( model, Cmd.none )

        NewEntry (Ok entry) ->
            ( { model | entry = Just entry }, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ h2 [ class "text-center" ] [ text "Chuck Norris Quotes" ]
        , p [ class "text-center" ]
            [ button [ class "btn btn-success", onClick JoinGame ] [ text "Join Game" ]
            , p []
                [ p [] (viewEntry model.entry)
                ]
            ]
        , blockquote []
            [ p [] []
            ]
        ]


viewEntry : Maybe Entry -> List (Html Msg)
viewEntry entry =
    case entry of
        Just e ->
            [ p [] [ text (Maybe.withDefault "No tag line" (List.head e.tagLines)) ]
            ]

        Nothing ->
            [ text "nothing yet" ]


decodeEntry : Json.Decode.Value -> Result Json.Decode.Error Entry
decodeEntry =
    Json.Decode.decodeValue entryDecoder


entryDecoder : Json.Decode.Decoder Entry
entryDecoder =
    Json.Decode.succeed Entry
        |> PipelineDecoder.required "tagLines" (Json.Decode.list Json.Decode.string)
        |> PipelineDecoder.required "year" Json.Decode.string


main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
