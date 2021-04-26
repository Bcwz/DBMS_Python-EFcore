using DetentionBarrackSetup.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack
{
    public static class MyDbContextExtension
    {
        public static void Seed(this MyDbContext context)
        {
            // shady way to flush db data then add seed data
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();


            OperationState offlineOpState = new OperationState
            {
                OperationStateId = 0,
                DisplayValue = "Offline"
            };

            OperationState onlineOpState = new OperationState
            {
                OperationStateId = 0,
                DisplayValue = "Online"
            };

            context.OperationStates.AddRange(offlineOpState, onlineOpState);
            context.SaveChanges();
        }
    }
}
