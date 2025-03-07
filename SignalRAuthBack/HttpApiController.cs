using Microsoft.AspNetCore.Mvc;

namespace SignalRAuthBack
{
    [ApiController]
    [Route("httpapi")]
    public class HttpApiController : ControllerBase 
    {
        [HttpGet("items")]
        public ActionResult<IEnumerable<string>> GetItems()
        {
            var items = new List<string> { "Item1", "Item2", "Item3" };
            return Ok(items);
        }

        [HttpGet("{id}")]
        public ActionResult<string> GetItem(int id)
        {
            if (id < 0)
            {
                return BadRequest("Invalid ID.");
            }

            var item = $"Item{id}";
            return Ok(item);
        }
    }
}
