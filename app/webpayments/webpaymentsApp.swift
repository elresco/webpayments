import SwiftUI
import WebKit

@main
struct webpaymentsApp: App {
    @StateObject private var vm = AppViewModel()
    
    var body: some Scene {
        WindowGroup {
            Group {
                switch vm.currentScene {
                case .main:
                    VStack {
                        Button("Show Integrated Paywall") {
                            vm.currentScene = .paywall
                        }
                        .buttonStyle(.borderedProminent)
                        .padding()
                        
                        Button("Show External Paywall") {
                            UIApplication.shared.open(vm.offering)
                        }
                            .buttonStyle(.borderedProminent)
                            .padding()
                    }
                case .paywall:
                    WebView(url: vm.offering)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .overlay(alignment: .topTrailing) {
                            Button(action: {
                                vm.currentScene = .main
                            }) {
                                Image(systemName: "xmark")
                                    .foregroundColor(.gray)
                                    .padding()
                            }
                        }
                }
            }
            .animation(.easeInOut, value: vm.currentScene)
            .onOpenURL { url in
                vm.handleUniversalLink(url)
            }
            .sheet(isPresented: $vm.showError) {
                Text("Offer not available")
            }
        }
    }
}
