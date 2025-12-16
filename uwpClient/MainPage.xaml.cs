using Microsoft.Identity.Client;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace UwpClient
{
    public sealed partial class MainPage : Page
    {
        // TODO: Replace the placeholders with your own client ID, tenant ID and API scope
        private const string ClientId = "your-uwp-client-id";
        private const string TenantId = "your-tenant-id";
        private const string ApiScope = "api://your-api-client-id/api.read";
        private const string ApiBaseUri = "http://localhost:3000";

        private readonly IPublicClientApplication _publicClientApp;
        private IAccount _account;

        public MainPage()
        {
            this.InitializeComponent();
            _publicClientApp = PublicClientApplicationBuilder.Create(ClientId)
                .WithAuthority(AzureCloudInstance.AzurePublic, TenantId)
                .WithRedirectUri("http://localhost")
                .Build();
        }

        private async void SignInButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var result = await _publicClientApp
                    .AcquireTokenInteractive(new[] { ApiScope })
                    .ExecuteAsync();
                _account = result.Account;
                CallApiButton.IsEnabled = true;
                ResultText.Text = $"Signed in as {result.Account.Username}";
            }
            catch (MsalException ex)
            {
                ResultText.Text = $"Sign‑in failed: {ex.Message}";
            }
        }

        private async void CallApiButton_Click(object sender, RoutedEventArgs e)
        {
            if (_account == null)
            {
                ResultText.Text = "Please sign in first.";
                return;
            }
            try
            {
                var result = await _publicClientApp
                    .AcquireTokenSilent(new[] { ApiScope }, _account)
                    .ExecuteAsync();
                string accessToken = result.AccessToken;
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var response = await httpClient.GetAsync($"{ApiBaseUri}/api/users");
                    var content = await response.Content.ReadAsStringAsync();
                    ResultText.Text = content;
                }
            }
            catch (MsalUiRequiredException)
            {
                // If we need to show the login UI again, call the sign‑in method
                SignInButton_Click(sender, e);
            }
            catch (Exception ex)
            {
                ResultText.Text = $"API call failed: {ex.Message}";
            }
        }
    }
}