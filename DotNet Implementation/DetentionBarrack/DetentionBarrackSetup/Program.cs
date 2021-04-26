using DetentionBarrack.Setup;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace DetentionBarrackSetup
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("CoreApp:Setup Starting...");
            using (var context = new MyDbContext())
            {
                // This will drop database, please reconnect after running.
                context.Seed();
            }
            Console.WriteLine("CoreApp:Setup Done!");
        }
    }
}
