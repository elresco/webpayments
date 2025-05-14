import SwiftUI
import Foundation

final class AppViewModel: ObservableObject {
    @Published var currentScene: SceneKey = .main
    @Published var showError: Bool = false
    
    let offering = URL(string: "https://pay.rev.cat/sandbox/xhzuheuvnipkaror")!
    
    // To test Universal Links + URL Type
    // Universal Link and URL Type work differently
    // URL Type has a better experience
    // They are managed under Target -> Info -> URL Type
    // URL Type work with schemas like: webpayments://path?key=value
    // And will trigger a pop up to open it directly your app
    // Universal Links will "suggest" use your app
    // The best way to do it is to send users a link like: https://subdomain.domain.com?offer=OFFER_ID
    // Then this page will try to force redirect to the URL Type schema, if it fails will send the user to a fallback url, typically to install the app
    // For Universal Links Apple will query the followind end point: https://subdomain.domain.com/.well-known/apple-app-site-association
    // this endpoint must return a JSON with the following format
    // { "applinks" : { "details" : [ { "appIDs" : [ "TEAM_ID.APP_BUNDLE" ], "components" : [{ "*" : "*" }] }] }}
    // you can validate your URL here: https://branch.io/resources/aasa-validator
    func handleUniversalLink(_ url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let queryItems = components.queryItems else {
            manageError(message: "No query parameters on URL.")
            return
        }
        
        if let text = queryItems.first(where: { $0.name == "offer" })?.value {
            if let url = URL(string: "https://pay.rev.cat/sandbox/\(text)") {
                UIApplication.shared.open(url)
                return
            }
            manageError(message: "Unknown offer: \(text)")
        }
        manageError(message: "No query parameters 'offer' found.")
    }
    private func manageError(message: String) {
        print(message)
        showError = true
    }
}
