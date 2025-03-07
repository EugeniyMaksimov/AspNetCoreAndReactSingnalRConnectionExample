using Microsoft.AspNetCore.SignalR;

namespace SignalRAuthBack
{
    public class MyRequest
    {
        public string? Property1 { get; set; }
    }

    public class DataResponse<T>
    {
        public T? Data { get; set; }
    }

    //Определяет методы клиента, которые будут вызываться при ответах сервера
    public interface ISignalRHubСlient
    {
        Task Issue(DataResponse<string> request);
    }

    public class SignalRHub : Hub<ISignalRHubСlient>
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("SignalR Hub Connected");
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine("SignalR Hub DisConnected");
            return base.OnDisconnectedAsync(exception);
        }

        public async Task GetIssues(MyRequest request)
        {
            try
            {
                for (int i = 0; i < 10; i++)
                {
                    DataResponse<string> response = new() { Data = $"Datum # {i}" };

                    // Отправляем текущую порцию данных вызывающему клиенту
                    await Clients.Caller.Issue(response);
                    await Task.Delay(100);
                }
            }
            finally
            {

                Context.Abort();
            }
        }
    }
}
